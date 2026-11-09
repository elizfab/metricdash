import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { RelatorioService } from '../../core/services/relatorio.service';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { Loading } from '../../shared/components/loading/loading';
import { ErrorState } from '../../shared/components/error-state/error-state';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsModule, StatCard, Loading, ErrorState],
  template: `
    <div class="dashboard">
      <h1 class="dashboard__titulo">Dashboard</h1>

      @if (carregando()) {
        <app-loading mensagem="Carregando métricas…" />
      } @else if (erro(); as msg) {
        <app-error-state [mensagem]="msg" (tentarNovamente)="carregar()" />
      } @else {
        <div class="md-grid md-grid--cols-4">
          <app-stat-card titulo="Total do mês" [valor]="totalMesCentavos()" icone="wallet" />
          <app-stat-card titulo="Passagens" [valor]="totalPassagensCentavos()" icone="car" />
          <app-stat-card titulo="Hospedagem" [valor]="totalHospedagemCentavos()" icone="home" />
          <app-stat-card titulo="Viagens" [valor]="quantidadeViagens()" icone="calendar" formato="numero" />
          <app-stat-card titulo="Média por viagem" [valor]="mediaPorViagemCentavos()" icone="rise" />
          <app-stat-card titulo="Média mensal" [valor]="mediaMensalCentavos()" icone="bar-chart" />
        </div>

        <div class="md-grid md-grid--cols-2 dashboard__charts">
          <div class="chart-card">
            <h3>Gastos por categoria</h3>
            <div echarts [options]="graficoCategoria()" class="chart"></div>
          </div>
          <div class="chart-card">
            <h3>Evolução mensal</h3>
            <div echarts [options]="graficoEvolucao()" class="chart"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .dashboard__titulo { margin: 0 0 24px; }
    .dashboard__charts { margin-top: 24px; }
    .chart-card {
      background: var(--md-surface, #242438);
      border: 1px solid var(--md-border, #38384f);
      border-radius: 12px;
      padding: 16px;
    }
    .chart-card h3 { margin: 0 0 12px; font-size: 15px; }
    .chart { width: 100%; height: 320px; }
  `,
})
export class Dashboard implements OnInit {
  private readonly relatorios = inject(RelatorioService);

  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  readonly totalMesCentavos = signal(0);
  readonly totalPassagensCentavos = signal(0);
  readonly totalHospedagemCentavos = signal(0);
  readonly quantidadeViagens = signal(0);
  readonly mediaPorViagemCentavos = signal(0);
  readonly mediaMensalCentavos = signal(0);

  private readonly dadosCategoria = signal<{ nome: string; total: number }[]>([]);
  private readonly dadosEvolucao = signal<{ mes: string; total: number }[]>([]);

  readonly graficoCategoria = signal<EChartsOption>({});
  readonly graficoEvolucao = signal<EChartsOption>({});

  private readonly agora = new Date();
  private readonly ano = this.agora.getFullYear();
  private readonly mes = this.agora.getMonth() + 1;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    forkJoin({
      mensal: this.relatorios.resumoMensal(this.ano),
      categorias: this.relatorios.resumoMensalCategoria(this.ano),
      custos: this.relatorios.custosViagens(),
    }).subscribe({
      next: ({ mensal, categorias, custos }) => {
        const mesAtual = mensal.find((m) => m.mes === this.mes);
        const totalMes = mesAtual?.total_geral_centavos ?? 0;
        const totalAnual = mensal.reduce((acc, m) => acc + m.total_geral_centavos, 0);
        const totalViagens = custos.reduce((acc, c) => acc + c.custo_total_viagem_centavos, 0);
        const qtdViagens = custos.length;

        this.totalMesCentavos.set(totalMes);
        this.quantidadeViagens.set(qtdViagens);
        this.mediaPorViagemCentavos.set(qtdViagens ? Math.round(totalViagens / qtdViagens) : 0);
        this.mediaMensalCentavos.set(mensal.length ? Math.round(totalAnual / mensal.length) : 0);

        const passagens = categorias
          .filter((c) => c.categoria_slug === 'passagem-onibus')
          .reduce((acc, c) => acc + c.total_centavos, 0);
        const hospedagem = custos.reduce((acc, c) => acc + c.total_hospedagem_centavos, 0);
        this.totalPassagensCentavos.set(passagens);
        this.totalHospedagemCentavos.set(hospedagem);

        const porCategoria = new Map<string, number>();
        for (const c of categorias) {
          if (c.mes === this.mes) {
            porCategoria.set(c.categoria, (porCategoria.get(c.categoria) ?? 0) + c.total_centavos);
          }
        }
        this.dadosCategoria.set(
          [...porCategoria.entries()].map(([nome, total]) => ({ nome, total })),
        );
        this.montarGraficos(mensal, categorias);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message || 'Falha ao carregar métricas.');
        this.carregando.set(false);
      },
    });
  }

  private montarGraficos(
    mensal: { mes: number; total_geral_centavos: number }[],
    categorias: { mes: number; categoria: string; total_centavos: number }[],
  ): void {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const totaisPorMes = new Map(mensal.map((m) => [m.mes, m.total_geral_centavos]));

    this.graficoEvolucao.set({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: meses },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'line',
          smooth: true,
          data: meses.map((_, i) => (totaisPorMes.get(i + 1) ?? 0) / 100),
        },
      ],
    });

    const catMes = categorias.filter((c) => c.mes === this.mes);
    this.graficoCategoria.set({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: catMes.map((c) => ({ name: c.categoria, value: c.total_centavos / 100 })),
        },
      ],
    });
  }
}
