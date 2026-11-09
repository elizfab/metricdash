import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styles: [],
  template: `
    <h1>Eu sou o Dash: MetricDash</h1>
    <p>Para quem ama métricas e indicadores.</p>

    <router-outlet />
  `,
})
export class App {}
