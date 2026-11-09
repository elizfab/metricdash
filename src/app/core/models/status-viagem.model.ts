export interface StatusViagem {
  readonly id: number;
  slug: string;
  nome: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
  criado_em: string;
}
