export interface Hotel {
  readonly id: string;
  nome: string;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  site: string | null;
  hora_checkin: string | null;
  hora_checkout: string | null;
  classificacao: number | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}
