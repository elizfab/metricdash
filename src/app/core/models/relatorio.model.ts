export interface ResumoCategoria {
  categoria: string;
  categoria_slug: string;
  total_centavos: number;
  quantidade_lancamentos: number;
}

export interface ResumoMensalCategoria {
  ano: number;
  mes: number;
  categoria: string;
  categoria_slug: string;
  total_centavos: number;
  quantidade_lancamentos: number;
}

export interface ResumoMensal {
  ano: number;
  mes: number;
  total_geral_centavos: number;
}

export interface CustoViagem {
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

export interface ResumoDashboard {
  ano: number;
  mes: number;
  total_mes_centavos: number;
  total_passagens_centavos: number;
  total_hospedagem_centavos: number;
  quantidade_viagens: number;
  media_por_viagem_centavos: number;
  media_mensal_centavos: number;
}
