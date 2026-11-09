import { danger, fail, warn } from 'danger';

// ---------------------------------------------------------------------------
// Constantes e padrões
// ---------------------------------------------------------------------------

const COMMIT_PATTERN =
  /^(funcionalidade|correcao|configuracao|documentacao|testes|refatoracao):\s+\S.{9,}$/;

const GENERIC_MESSAGES = new Set([
  'ajustes',
  'ajuste',
  'teste',
  'testes',
  'update',
  'updates',
  'correcao',
  'correção',
  'mudancas',
  'mudanças',
  'alteracoes',
  'alterações',
  'wip',
  'fix',
  'fixes',
  'commit',
]);

const BRANCH_PATTERN = /^(feature|fix|chore|docs|hotfix|refactor)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PR_TITLE_PATTERN =
  /^(Funcionalidade|Correção|Correccao|Configuração|Configuracao|Documentação|Documentacao|Testes|Refatoração|Refatoracao):\s+\S.{9,}$/;

const PROTECTED_BRANCHES = ['main', 'develop'];

const ENGLISH_HINT =
  /\b(add|added|adding|update|updated|fix|fixed|create|created|remove|removed|setup|set up|config|configure|improve|refactor|bump|merge|initial|wip)\b/i;

const PORTUGUESE_CHARS = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/;

const SENSITIVE_FILE_PATTERNS = [
  /(^|\/)\.env(\.|$)/,
  /\.(pem|key|p12|pfx)$/i,
  /(^|\/)(credentials|secrets?)\./i,
];

const CONFIG_FILES = [
  'package.json',
  'package-lock.json',
  'angular.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.spec.json',
  'eslint.config.js',
  'jest.config.mjs',
  'dangerfile.ts',
];

const PR_BODY_SECTIONS = [
  { name: 'Objetivo', pattern: /##\s*objetivo/i },
  { name: 'Alterações realizadas', pattern: /##\s*altera(ç|c)(õ|o)es realizadas/i },
  { name: 'Validações', pattern: /##\s*valida(ç|c)(õ|o)es/i },
  { name: 'Documentação', pattern: /##\s*documenta(ç|c)(ã|a)o/i },
];

const MAX_CHANGED_LINES = 1000;
const MAX_FILES = 60;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasPortugueseText(text: string): boolean {
  return PORTUGUESE_CHARS.test(text) || !ENGLISH_HINT.test(text);
}

async function getAddedLines(file: string): Promise<string[]> {
  try {
    const diff = await danger.git.diffForFile(file);
    if (!diff) {
      return [];
    }
    return diff.added.split('\n').filter((line) => line.trim().length > 0);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Regras — somente executam quando há contexto de PR/CI (danger.github)
// ---------------------------------------------------------------------------

// Em `danger local`/`danger pr` o objeto `danger.github` pode estar indefinido.
const pr = danger.github?.pr as
  | {
      head: { ref: string };
      base: { ref: string };
      title: string;
      body?: string | null;
      additions: number;
      deletions: number;
    }
  | undefined;
const commits = danger.github?.commits ?? [];
const changedFiles = danger.git.modified_files;

if (pr) {
  void (async () => {
  // 7.2 — Validação das mensagens de commit
  const invalidCommits = commits.filter((commit) => {
    const title = commit.commit.message.split('\n')[0].trim();
    if (!COMMIT_PATTERN.test(title)) {
      return true;
    }
    const description = title.split(':')[1]?.trim().toLowerCase() ?? '';
    return GENERIC_MESSAGES.has(description);
  });

  if (invalidCommits.length > 0) {
    const list = invalidCommits
      .map((c) => `- \`${c.sha.slice(0, 7)}\` ${c.commit.message.split('\n')[0]}`)
      .join('\n');
    fail(
      `Foram encontrados ${invalidCommits.length} commit(s) com mensagem fora do padrão.\n` +
        `Use um dos prefixos: funcionalidade, correcao, configuracao, documentacao, testes, refatoracao.\n` +
        `Exemplo: \`configuracao: adiciona fonte Open Sans ao projeto\`.\n\n${list}`,
    );
  } else if (commits.length > 0) {
    const englishCommits = commits.filter((commit) => {
      const title = commit.commit.message.split('\n')[0];
      return !hasPortugueseText(title);
    });
    if (englishCommits.length > 0) {
      warn(
        `${englishCommits.length} commit(s) parecem estar em inglês. As mensagens devem estar em português.`,
      );
    }
  }

  // 7.3 — Validação do nome da branch de origem
  const sourceBranch = pr.head.ref;
  if (PROTECTED_BRANCHES.includes(sourceBranch)) {
    fail(
      `A branch \`${sourceBranch}\` é protegida e não pode ser origem de Pull Request. ` +
        `Crie uma branch de trabalho (feature/, fix/, chore/, docs/, hotfix/, refactor/).`,
    );
  } else if (!BRANCH_PATTERN.test(sourceBranch)) {
    fail(
      `O nome da branch \`${sourceBranch}\` não segue o padrão. ` +
        `Use um dos prefixos: feature/, fix/, chore/, docs/, hotfix/, refactor/ com kebab-case.`,
    );
  }

  // 7.7 — Verificar destino do PR
  if (pr.base.ref !== 'develop' && !sourceBranch.startsWith('hotfix/')) {
    fail(
      `O Pull Request deve ter \`develop\` como branch de destino (destino atual: \`${pr.base.ref}\`). ` +
        `Apenas branches \`hotfix/\` podem mirar \`main\`.`,
    );
  }

  // 7.4 — Validação do título do PR
  const title = pr.title.trim();
  if (!title) {
    fail('O título do Pull Request está vazio.');
  } else if (!PR_TITLE_PATTERN.test(title)) {
    fail(
      `O título "${title}" não segue o padrão. Use um dos prefixos em português: ` +
        `Funcionalidade:, Correção:, Configuração:, Documentação:, Testes:, Refatoração:.`,
    );
  } else if (!hasPortugueseText(title)) {
    warn(`O título do PR parece estar em inglês: "${title}". Títulos devem estar em português.`);
  }

  // 7.5 — Validação da descrição do PR
  const body = pr.body ?? '';
  if (!body.trim()) {
    fail('A descrição do Pull Request está vazia. Utilize o modelo de descrição padronizado.');
  } else {
    const missingSections = PR_BODY_SECTIONS.filter((s) => !s.pattern.test(body)).map(
      (s) => s.name,
    );
    if (missingSections.length > 0) {
      warn(
        `A descrição do PR não contém as seções: ${missingSections.join(', ')}. ` +
          `Modelo esperado: Objetivo, Alterações realizadas, Validações, Evidências, Documentação.`,
      );
    }
  }

  // 7.6.1 — PR excessivamente grande
  const changedLines = pr.additions + pr.deletions;
  if (changedLines > MAX_CHANGED_LINES) {
    warn(
      `Este PR altera ${changedLines} linhas (acima do limite recomendado de ${MAX_CHANGED_LINES}). ` +
        `Considere dividi-lo em PRs menores.`,
    );
  }
  if (changedFiles.length > MAX_FILES) {
    warn(`Este PR modifica ${changedFiles.length} arquivos (limite recomendado: ${MAX_FILES}).`);
  }

  // 7.6.8 — Divergência package.json / lockfile
  const hasPkg = changedFiles.includes('package.json');
  const hasLock = changedFiles.includes('package-lock.json');
  if (hasPkg !== hasLock) {
    warn(
      'Alterações em `package.json` sem atualização correspondente em `package-lock.json` (ou vice-versa). ' +
        'Verifique se o lockfile está sincronizado.',
    );
  }

  // 7.6.3 e 7.6.4 — console.log, TODO e FIXME adicionados
  const codeFiles = changedFiles.filter(
    (f) => /\.(ts|js|mjs|html)$/.test(f) && !f.endsWith('.spec.ts') && !f.endsWith('eslint.config.js'),
  );
  const consoleHits: string[] = [];
  const todoHits: string[] = [];
  for (const file of codeFiles) {
    const added = await getAddedLines(file);
    if (added.some((l) => /\bconsole\.(log|debug|info)\s*\(/.test(l))) {
      consoleHits.push(file);
    }
    if (added.some((l) => /\b(TODO|FIXME)\b/.test(l))) {
      todoHits.push(file);
    }
  }
  if (consoleHits.length > 0) {
    warn(`Arquivos com \`console.log\` adicionado: ${consoleHits.join(', ')}`);
  }
  if (todoHits.length > 0) {
    warn(`Arquivos com comentários \`TODO\`/\`FIXME\` adicionados: ${todoHits.join(', ')}`);
  }

  // 7.6.2 — Documentação ausente para alterações de configuração
  const hasConfigChange = changedFiles.some((f) => CONFIG_FILES.includes(f));
  const hasDocsChange = changedFiles.some((f) => f.startsWith('docs/'));
  if (hasConfigChange && !hasDocsChange) {
    warn(
      'Alterações em arquivos de configuração detectadas sem documentação correspondente em `docs/`. ' +
        'Documente a mudança em `docs/setup-project/`.',
    );
  }

  // 7.6.5 e 7.6.9 — Arquivos sensíveis
  const sensitiveFiles = changedFiles.filter((f) =>
    SENSITIVE_FILE_PATTERNS.some((p) => p.test(f)),
  );
  if (sensitiveFiles.length > 0) {
    warn(
      `Arquivos sensíveis modificados: ${sensitiveFiles.join(', ')}. ` +
        'Confirme que nenhuma credencial foi exposta e justifique a alteração na descrição do PR.',
    );
  }
  })();
}

// ---------------------------------------------------------------------------
// Validações que também funcionam em `danger local` (sem PR)
// ---------------------------------------------------------------------------

if (commits.length > 0) {
  const invalidCommits = commits.filter((commit) => {
    const title = commit.commit.message.split('\n')[0].trim();
    if (!COMMIT_PATTERN.test(title)) {
      return true;
    }
    const description = title.split(':')[1]?.trim().toLowerCase() ?? '';
    return GENERIC_MESSAGES.has(description);
  });

  if (invalidCommits.length > 0 && !pr) {
    warn(
      `${invalidCommits.length} commit(s) fora do padrão de mensagem (contexto local, sem PR). ` +
        invalidCommits.map((c) => `\`${c.commit.message.split('\n')[0]}\``).join(', '),
    );
  }
}
