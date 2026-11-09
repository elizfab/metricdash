export type TipoFormaPagamento = 'credito' | 'debito' | 'pix' | 'dinheiro' | 'boleto' | string;

export interface FormaPagamento {
  readonly id: string;
  nome: string;
  tipo: TipoFormaPagamento | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
