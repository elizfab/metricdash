import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface OpcoesCrud {
  /** colunas extras no select (joins) */
  select?: string;
  /** filtros eq aplicados em sequência */
  filtros?: Record<string, string | number | boolean | null | undefined>;
}

/**
 * Base genérica de CRUD sobre uma tabela do Supabase.
 * Cada service de domínio estende configurando `tabela` e `selectPadrao`.
 */
@Injectable({ providedIn: 'root' })
export class CrudService<T extends { id: string | number }> {
  protected readonly supabase = inject(SupabaseService);

  protected tabela = '';
  protected selectPadrao = '*';

  listar(opcoes: OpcoesCrud = {}): Observable<T[]> {
    let q = this.supabase.client
      .from(this.tabela)
      .select(opcoes.select ?? this.selectPadrao);

    for (const [campo, valor] of Object.entries(opcoes.filtros ?? {})) {
      if (valor !== undefined && valor !== null && valor !== '') {
        q = q.eq(campo, valor);
      }
    }

    return from(q).pipe(map(({ data, error }) => this.tratar(data, error)));
  }

  buscarPorId(id: string | number): Observable<T> {
    return from(
      this.supabase.client
        .from(this.tabela)
        .select(this.selectPadrao)
        .eq('id', id)
        .single(),
    ).pipe(map(({ data, error }) => this.tratarUm(data, error)));
  }

  criar(payload: Partial<T>): Observable<T> {
    return from(
      this.supabase.client
        .from(this.tabela)
        .insert(payload as T)
        .select(this.selectPadrao)
        .single(),
    ).pipe(map(({ data, error }) => this.tratarUm(data, error)));
  }

  atualizar(id: string | number, payload: Partial<T>): Observable<T> {
    return from(
      this.supabase.client
        .from(this.tabela)
        .update(payload as T)
        .eq('id', id)
        .select(this.selectPadrao)
        .single(),
    ).pipe(map(({ data, error }) => this.tratarUm(data, error)));
  }

  remover(id: string | number): Observable<void> {
    return from(this.supabase.client.from(this.tabela).delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  /** Lista paginada com count exato. */
  listarPaginado(
    paginacao: { pagina: number; tamanhoPagina: number },
    opcoes: OpcoesCrud = {},
  ): Observable<{ dados: T[]; total: number }> {
    const inicio = (paginacao.pagina - 1) * paginacao.tamanhoPagina;
    let q = this.supabase.client
      .from(this.tabela)
      .select(opcoes.select ?? this.selectPadrao, { count: 'exact' })
      .range(inicio, inicio + paginacao.tamanhoPagina - 1);

    for (const [campo, valor] of Object.entries(opcoes.filtros ?? {})) {
      if (valor !== undefined && valor !== null && valor !== '') {
        q = q.eq(campo, valor);
      }
    }

    return from(q).pipe(
      map(({ data, error, count }) => {
        if (error) throw error;
        return { dados: (data ?? []) as unknown as T[], total: count ?? 0 };
      }),
    );
  }

  protected tratar(data: unknown, error: { message: string } | null): T[] {
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as T[];
  }

  protected tratarUm(data: unknown, error: { message: string } | null): T {
    if (error) throw new Error(error.message);
    return data as T;
  }
}
