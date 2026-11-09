export interface FiltroLancamentos {
  ano?: number;
  mes?: number;
  categoriaId?: string;
  viagemId?: string;
  dominioId?: string;
  busca?: string;
}

export interface FiltroViagens {
  dominioId?: string;
  ano?: number;
  statusId?: number;
}

export interface ErroApi {
  codigo: string;
  mensagem: string;
}
