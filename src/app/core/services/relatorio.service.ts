import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import {
  CustoViagem,
  ResumoCategoria,
  ResumoMensal,
  ResumoMensalCategoria,
} from '../models/relatorio.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly supabase = inject(SupabaseService);

  /** Totais por mês/categoria — vw_resumo_mensal_categoria */
  resumoMensalCategoria(ano?: number): Observable<ResumoMensalCategoria[]> {
    let q = this.supabase.client.from('vw_resumo_mensal_categoria').select('*').order('mes');
    if (ano) q = q.eq('ano', ano);
    return this.executar<ResumoMensalCategoria[]>(q);
  }

  /** Total geral por mês — vw_resumo_mensal */
  resumoMensal(ano?: number): Observable<ResumoMensal[]> {
    let q = this.supabase.client.from('vw_resumo_mensal').select('*').order('mes');
    if (ano) q = q.eq('ano', ano);
    return this.executar<ResumoMensal[]>(q);
  }

  /** Custo consolidado de uma viagem — vw_custo_viagem */
  custoViagem(viagemId: string): Observable<CustoViagem> {
    return from(
      this.supabase.client
        .from('vw_custo_viagem')
        .select('*')
        .eq('viagem_id', viagemId)
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as CustoViagem;
      }),
    );
  }

  /** Todas as viagens com custo — vw_custo_viagem */
  custosViagens(): Observable<CustoViagem[]> {
    return this.executar<CustoViagem[]>(
      this.supabase.client.from('vw_custo_viagem').select('*').order('data_inicio'),
    );
  }

  private executar<T>(q: unknown): Observable<T> {
    return from(q as PromiseLike<{ data: unknown; error: { message: string } | null }>).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as T;
      }),
    );
  }
}

export type { ResumoCategoria };
