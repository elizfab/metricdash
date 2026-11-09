import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Viagem, ViagemResumo } from '../models/viagem.model';
import { CrudService } from './crud.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ViagemService extends CrudService<Viagem> {
  protected override tabela = 'viagens';
  protected override selectPadrao =
    '*, dominios(slug, nome), status_viagem(id, slug, nome)';

  private readonly sb = inject(SupabaseService);

  resumo(id: string): Observable<ViagemResumo> {
    return from(
      this.sb.client
        .from('vw_custo_viagem')
        .select('*')
        .eq('viagem_id', id)
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as ViagemResumo;
      }),
    );
  }
}
