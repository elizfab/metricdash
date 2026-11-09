import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="app-shell">
      <app-header />
      <main class="app-shell__content">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: `
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--md-bg, #171725);
      color: var(--md-text, #fdf7fe);
    }
    .app-shell__content {
      flex: 1;
      padding: 24px;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }
  `,
})
export class Shell {}
