import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Configuracao } from '../models/configuracao.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoService {
  private readonly supabase = inject(SupabaseService);

  listar(): Observable<Configuracao[]> {
    return from(this.supabase.client.from('configuracoes').select('*').order('chave')).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return (data ?? []) as unknown as Configuracao[];
      }),
    );
  }

  atualizar(chave: string, valor: string): Observable<Configuracao> {
    return from(
      this.supabase.client
        .from('configuracoes')
        .update({ valor, atualizado_em: new Date().toISOString() })
        .eq('chave', chave)
        .select('*')
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as Configuracao;
      }),
    );
  }
}
