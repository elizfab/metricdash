export interface Lancamento {
  readonly id: string;
  dominio_id: string;
  categoria_id: string;
  forma_pagamento_id: string | null;
  viagem_id: string | null;
  hotel_id: string | null;
  descricao: string;
  data_despesa: string;
  quantidade: number;
  valor_unitario_centavos: number;
  readonly valor_total_centavos: number;
  origem: string | null;
  destino: string | null;
  observacoes: string | null;
  readonly mes: number;
  readonly ano: number;
  criado_em: string;
  atualizado_em: string;
}
