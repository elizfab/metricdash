export interface Paginacao {
  pagina: number;
  tamanhoPagina: number;
}

export interface Pagina<T> {
  dados: T[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
}
