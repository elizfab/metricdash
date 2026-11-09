import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RelatorioService } from '../../core/services/relatorio.service';
import { ResumoMensalCategoria, ResumoMensal as ResumoMensalItem } from '../../core/models/relatorio.model';
import { Loading } from '../../shared/components/loading/loading';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { MoedaPipe } from '../../shared/pipes/moeda.pipe';

interface LinhaResumo {
  categoria: string;
  valores: number[]; // centavos por mês 1-12
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  selector: 'app-resumo-mensal',
  imports: [FormsModule, NzSelectModule, NgxEchartsModule, Loading, ErrorState, EmptyState, MoedaPipe],
  template: `
    <div class="resumo">
      <div class="resumo__header">
        <h1>Resumo Mensal — {{ ano() }}</h1>
        <nz-select [(ngModel)]="anoSelecionado" (ngModelChange)="carregar()" style="width:120px">
          @for (a of anos(); track a) { <nz-option [nzValue]="a" [nzLabel]="'' + a" /> }
        </nz-select>
      </div>

      @if (carregando()) {
        <app-loading mensagem="Carregando resumo…" />
      } @else if (erro(); as msg) {
        <app-error-state [mensagem]="msg" (tentarNovamente)="carregar()" />
      } @else {
        <div class="md-grid md-grid--cols-2 resumo__charts">
          <div class="chart-card">
            <h3>Totais por mês</h3>
            <div echarts [options]="graficoBarras()" class="chart"></div>
          </div>
          <div class="chart-card">
            <h3>Distribuição por categoria</h3>
            <div echarts [options]="graficoPizza()" class="chart"></div>
          </div>
        </div>

        <div class="chart-card resumo__tabela">
          <h3>Detalhamento por categoria</h3>
          <table class="tabela-resumo">
            <thead>
              <tr>
                <th>Categoria</th>
                @for (m of meses; track m) { <th nzAlign="right">{{ m }}</th> }
                <th nzAlign="right">Total</th>
              </tr>
            </thead>
            <tbody>
              @for (linha of linhas(); track linha.categoria) {
                <tr>
                  <td>{{ linha.categoria }}</td>
                  @for (v of linha.valores; track $index) {
                    <td nzAlign="right">{{ v ? (v | moeda) : '—' }}</td>
                  }
                  <td nzAlign="right"><strong>{{ totalLinha(linha) | moeda }}</strong></td>
                </tr>
              } @empty {
                <tr><td [attr.colspan]="14"><app-empty-state mensagem="Sem dados no período." /></td></tr>
              }
              @if (linhas().length > 0) {
                <tr class="tabela-resumo__total">
                  <td>Total geral</td>
                  @for (v of totaisPorMes(); track $index) {
                    <td nzAlign="right"><strong>{{ v | moeda }}</strong></td>
                  }
                  <td nzAlign="right"><strong>{{ totalGeral() | moeda }}</strong></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: `
    .resumo__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .resumo__header h1 { margin: 0; }
    .resumo__charts { margin-bottom: 24px; }
    .chart-card {
      background: var(--md-surface, #242438);
      border: 1px solid var(--md-border, #38384f);
      border-radius: 12px;
      padding: 16px;
    }
    .chart-card h3 { margin: 0 0 12px; font-size: 15px; }
    .chart { width: 100%; height: 300px; }
    .tabela-resumo { width: 100%; border-collapse: collapse; }
    .tabela-resumo th, .tabela-resumo td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--md-border, #38384f);
      font-size: 13px;
    }
    .tabela-resumo__total td { border-top: 2px solid var(--md-border, #38384f); }
  `,
})
export class ResumoMensal implements OnInit {
  private readonly relatorios = inject(RelatorioService);

  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly linhas = signal<LinhaResumo[]>([]);
  readonly ano = signal(new Date().getFullYear());
  readonly graficoBarras = signal<EChartsOption>({});
  readonly graficoPizza = signal<EChartsOption>({});

  anoSelecionado = new Date().getFullYear();
  readonly anos = signal<number[]>([]);
  readonly meses = MESES;

  private dados: { categorias: ResumoMensalCategoria[]; mensal: ResumoMensalItem[] } = {
    categorias: [],
    mensal: [],
  };

  ngOnInit(): void {
    const atual = new Date().getFullYear();
    this.anos.set([atual, atual - 1, atual - 2]);
    this.carregar();
  }

  carregar(): void {
    this.ano.set(this.anoSelecionado);
    this.carregando.set(true);
    this.erro.set(null);
    forkJoin({
      categorias: this.relatorios.resumoMensalCategoria(this.anoSelecionado),
      mensal: this.relatorios.resumoMensal(this.anoSelecionado),
    }).subscribe({
      next: ({ categorias, mensal }) => {
        this.dados = { categorias, mensal };
        this.montarLinhas();
        this.montarGraficos();
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  private montarLinhas(): void {
    const mapa = new Map<string, number[]>();
    for (const c of this.dados.categorias) {
      if (!mapa.has(c.categoria)) mapa.set(c.categoria, Array(12).fill(0));
      mapa.get(c.categoria)![c.mes - 1] += c.total_centavos;
    }
    this.linhas.set(
      [...mapa.entries()]
        .map(([categoria, valores]) => ({ categoria, valores }))
        .sort((a, b) => this.totalLinha(b) - this.totalLinha(a)),
    );
  }

  private montarGraficos(): void {
    const totais = Array(12).fill(0);
    for (const m of this.dados.mensal) totais[m.mes - 1] += m.total_geral_centavos;

    this.graficoBarras.set({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: MESES },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: totais.map((v) => v / 100) }],
    });

    const porCategoria = new Map<string, number>();
    for (const c of this.dados.categorias) {
      porCategoria.set(c.categoria, (porCategoria.get(c.categoria) ?? 0) + c.total_centavos);
    }
    this.graficoPizza.set({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [...porCategoria.entries()].map(([name, v]) => ({ name, value: v / 100 })),
        },
      ],
    });
  }

  totaisPorMes(): number[] {
    const totais = Array(12).fill(0);
    for (const linha of this.linhas()) {
      linha.valores.forEach((v, i) => (totais[i] += v));
    }
    return totais;
  }

  totalLinha(linha: LinhaResumo): number {
    return linha.valores.reduce((a, b) => a + b, 0);
  }

  totalGeral(): number {
    return this.totaisPorMes().reduce((a, b) => a + b, 0);
  }
}
