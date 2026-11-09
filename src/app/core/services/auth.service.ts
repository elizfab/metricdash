import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Perfil } from '../models/perfil.model';
import { PerfilService } from './perfil.service';
import { SupabaseService } from './supabase.service';

export interface Credenciais {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly perfilService = inject(PerfilService);

  entrar({ email, password }: Credenciais): Observable<void> {
    return from(this.supabase.client.auth.signInWithPassword({ email, password })).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      }),
    );
  }

  registrar({ email, password, nome }: Credenciais & { nome: string }): Observable<void> {
    return from(
      this.supabase.client.auth.signUp({
        email,
        password,
        options: { data: { nome } },
      }),
    ).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      }),
    );
  }

  sair(): Observable<void> {
    return from(this.supabase.client.auth.signOut()).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
      }),
    );
  }

  sessao(): Observable<boolean> {
    return from(this.supabase.client.auth.getSession()).pipe(
      map(({ data }) => data.session !== null),
    );
  }

  /** Sessão atual + perfil do usuário (se existir). */
  usuarioAtual(): Observable<{ id: string; email?: string; perfil: Perfil | null } | null> {
    return from(this.supabase.client.auth.getUser()).pipe(
      map(({ data }) => {
        const user = data.user;
        return user ? { id: user.id, email: user.email, perfil: null } : null;
      }),
      // perfil carregado separadamente via PerfilService.buscarPorAuthUser
    );
  }
}
