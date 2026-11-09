import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Perfil } from '../models/perfil.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly supabase = inject(SupabaseService);

  buscarPorAuthUser(authUserId: string): Observable<Perfil | null> {
    return from(
      this.supabase.client
        .from('perfis')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return (data as unknown as Perfil) ?? null;
      }),
    );
  }

  atualizar(id: string, payload: Partial<Perfil>): Observable<Perfil> {
    return from(
      this.supabase.client
        .from('perfis')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as Perfil;
      }),
    );
  }
}
