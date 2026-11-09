import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Lancamento } from '../models/lancamento.model';
import { Pagina } from '../models/paginacao.model';
import { FiltroLancamentos } from '../types/filtros.type';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class LancamentoService {
  private readonly supabase = inject(SupabaseService);

  private readonly select =
    '*, categorias_despesa(nome, slug), viagens(identificador), hoteis(nome)';

  listar(
    filtros: FiltroLancamentos,
    paginacao: { pagina: number; tamanhoPagina: number },
  ): Observable<Pagina<Lancamento>> {
    const inicio = (paginacao.pagina - 1) * paginacao.tamanhoPagina;

    let q = this.supabase.client
      .from('lancamentos')
      .select(this.select, { count: 'exact' })
      .range(inicio, inicio + paginacao.tamanhoPagina - 1)
      .order('data_despesa', { ascending: false });

    if (filtros.dominioId) q = q.eq('dominio_id', filtros.dominioId);
    if (filtros.viagemId) q = q.eq('viagem_id', filtros.viagemId);
    if (filtros.ano) q = q.eq('ano', filtros.ano);
    if (filtros.mes) q = q.eq('mes', filtros.mes);
    if (filtros.categoriaId) q = q.eq('categoria_id', filtros.categoriaId);
    if (filtros.busca) q = q.ilike('descricao', `%${filtros.busca}%`);

    return from(q).pipe(
      map(({ data, error, count }) => {
        if (error) throw new Error(error.message);
        return {
          dados: (data ?? []) as unknown as Lancamento[],
          total: count ?? 0,
          pagina: paginacao.pagina,
          tamanhoPagina: paginacao.tamanhoPagina,
        };
      }),
    );
  }

  buscarPorId(id: string): Observable<Lancamento> {
    return from(
      this.supabase.client.from('lancamentos').select(this.select).eq('id', id).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as Lancamento;
      }),
    );
  }

  criar(payload: Partial<Lancamento>): Observable<Lancamento> {
    return this.mutacao('insert', payload);
  }

  atualizar(id: string, payload: Partial<Lancamento>): Observable<Lancamento> {
    return this.mutacao('update', payload, id);
  }

  remover(id: string): Observable<void> {
    return from(this.supabase.client.from('lancamentos').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      }),
    );
  }

  private mutacao(
    operacao: 'insert' | 'update',
    payload: Partial<Lancamento>,
    id?: string,
  ): Observable<Lancamento> {
    const base = this.supabase.client.from('lancamentos');
    const q =
      operacao === 'insert'
        ? base.insert(payload).select(this.select).single()
        : base.update(payload).eq('id', id!).select(this.select).single();
    return from(q).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as Lancamento;
      }),
    );
  }
}
