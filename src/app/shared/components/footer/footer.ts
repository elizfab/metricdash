import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="app-footer">
      <span>MetricDash — Para quem ama métricas e indicadores.</span>
    </footer>
  `,
  styles: `
    .app-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      font-size: 12px;
      color: var(--md-text-secondary, #b8b8cc);
      background: var(--md-surface, #242438);
      border-top: 1px solid var(--md-border, #38384f);
    }
  `,
})
export class Footer {}
