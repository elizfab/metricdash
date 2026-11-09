export interface CategoriaDespesa {
  readonly id: string;
  dominio_id: string;
  nome: string;
  slug: string;
  icone: string | null;
  ordem: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
