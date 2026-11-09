/**
 * MetricDash — Script de screenshots
 * ----------------------------------
 * Estrutura inicial para futuras capturas de tela da aplicação.
 *
 * STATUS: implementação pendente.
 *
 * Este script será evoluído em etapas futuras para:
 *  - Subir/verificar a aplicação Angular (http://localhost:6080).
 *  - Navegar pelos cenários definidos (ex.: /dashboard, /login, /logout).
 *  - Capturar screenshots em ambos os temas (dark e light).
 *  - Salvar as imagens em um diretório de artefatos.
 *
 * Por enquanto, o comando `npm run screenshots` executa com sucesso
 * sem gerar nenhuma captura, conforme o escopo da etapa atual.
 */

import { chromium } from '@playwright/test';

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:6080';

// TODO(etapa futura): implementar os cenários de captura.
// Exemplo de estrutura planejada:
//   const browser = await chromium.launch();
//   const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
//   await page.goto(`${BASE_URL}/dashboard`);
//   await page.screenshot({ path: 'screenshots/dashboard-dark.png', fullPage: true });
//   await browser.close();

async function main() {
  // Verifica se o Playwright está instalado sem lançar o navegador.
  void chromium;
  void BASE_URL;
  console.log('[screenshots] Estrutura inicial carregada.');
  console.log(`[screenshots] Nenhum cenário de captura implementado ainda.`);
  console.log(`[screenshots] URL base prevista: ${BASE_URL}`);
}

main().catch((error) => {
  console.error('[screenshots] Falha inesperada:', error);
  process.exitCode = 1;
});
