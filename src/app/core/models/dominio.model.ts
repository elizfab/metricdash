export interface Dominio {
  readonly id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
