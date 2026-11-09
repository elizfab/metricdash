import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NzButtonModule, NzIconModule],
  template: `
    <header class="app-header">
      <a class="app-header__logo" routerLink="/dashboard">
        <span class="app-header__dash">Dash</span><span>MetricDash</span>
      </a>
      <nav class="app-header__nav">
        <a routerLink="/dashboard" nz-button nzType="text">Dashboard</a>
        <a routerLink="/lancamentos" nz-button nzType="text">Lançamentos</a>
        <a routerLink="/viagens" nz-button nzType="text">Viagens</a>
        <a routerLink="/resumo-mensal" nz-button nzType="text">Resumo</a>
        <a routerLink="/configuracoes" nz-button nzType="text">Configurações</a>
        <a routerLink="/logout" nz-button nzType="text" nzDanger>
          <span nz-icon nzType="logout"></span> Sair
        </a>
      </nav>
    </header>
  `,
  styles: `
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 24px;
      background: var(--md-surface, #242438);
      border-bottom: 1px solid var(--md-border, #38384f);
    }
    .app-header__logo {
      font-size: 18px;
      font-weight: 700;
      color: var(--md-text, #fdf7fe);
      text-decoration: none;
    }
    .app-header__dash { color: #17b4da; }
    .app-header__nav { display: flex; gap: 4px; align-items: center; }
  `,
})
export class Header {}
