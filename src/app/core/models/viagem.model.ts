import { StatusViagem } from './status-viagem.model';

export interface Viagem {
  readonly id: string;
  dominio_id: string;
  identificador: string;
  origem: string | null;
  destino: string | null;
  data_inicio: string;
  data_fim: string;
  readonly dias: number;
  observacoes: string | null;
  status_id: number;
  criado_em: string;
  atualizado_em: string;
}

/** Projeção da view vw_custo_viagem — custo consolidado sem duplicar. */
export interface ViagemResumo {
  viagem_id: string;
  identificador: string;
  origem: string | null;
  destino: string | null;
  data_inicio: string;
  data_fim: string;
  dias: number;
  total_hospedagem_centavos: number;
  total_diarias: number;
  total_lancamentos_centavos: number;
  custo_total_viagem_centavos: number;
}
