import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzAlertModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1 class="login-titulo">MetricDash</h1>
        <p class="login-sub">Para quem ama métricas e indicadores.</p>

        @if (erro()) {
          <nz-alert nzType="error" [nzMessage]="erro()!" nzShowIcon />
        }

        <form nz-form [formGroup]="form" (ngSubmit)="entrar()">
          <nz-form-item>
            <nz-form-label>E-mail</nz-form-label>
            <nz-form-control nzErrorTip="Informe um e-mail válido">
              <input nz-input formControlName="email" type="email" placeholder="voce@email.com" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>Senha</nz-form-label>
            <nz-form-control nzErrorTip="Informe a senha">
              <input nz-input formControlName="password" type="password" placeholder="••••••••" />
            </nz-form-control>
          </nz-form-item>

          <button
            nz-button
            nzType="primary"
            nzBlock
            [nzLoading]="carregando()"
            [disabled]="form.invalid"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  `,
  styles: `
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-bg, #171725);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 32px;
      background: var(--md-surface, #242438);
      border: 1px solid var(--md-border, #38384f);
      border-radius: 12px;
    }
    .login-titulo {
      margin: 0 0 4px;
      font-size: 28px;
      color: var(--md-text, #fdf7fe);
    }
    .login-sub {
      margin: 0 0 24px;
      color: var(--md-text-secondary, #b8b8cc);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  entrar(): void {
    if (this.form.invalid) return;
    this.carregando.set(true);
    this.erro.set(null);

    this.auth.entrar(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e: Error) => {
        this.erro.set(e.message || 'Falha ao entrar. Verifique suas credenciais.');
        this.carregando.set(false);
      },
    });
  }
}
