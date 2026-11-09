export interface Hospedagem {
  readonly id: string;
  viagem_id: string;
  hotel_id: string | null;
  check_in: string;
  check_out: string;
  readonly diarias: number;
  valor_diaria_centavos: number;
  readonly valor_total_centavos: number;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
}
