import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Lancamento } from '../../core/models/lancamento.model';
import { LancamentoService } from '../../core/services/lancamento.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { FormaPagamentoService } from '../../core/services/forma-pagamento.service';
import { ViagemService } from '../../core/services/viagem.service';
import { HotelService } from '../../core/services/hotel.service';
import { DominioService } from '../../core/services/dominio.service';
import { CategoriaDespesa } from '../../core/models/categoria-despesa.model';
import { FormaPagamento } from '../../core/models/forma-pagamento.model';
import { Viagem } from '../../core/models/viagem.model';
import { Hotel } from '../../core/models/hotel.model';
import { Loading } from '../../shared/components/loading/loading';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { MoedaPipe } from '../../shared/pipes/moeda.pipe';

@Component({
  selector: 'app-lancamentos',
  imports: [
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzDatePickerModule,
    NzFormModule,
    NzModalModule,
    Loading,
    ErrorState,
    EmptyState,
    MoedaPipe,
  ],
  template: `
    <div class="lancamentos">
      <div class="lancamentos__header">
        <h1>Lançamentos</h1>
        <button nz-button nzType="primary" (click)="abrirModal()">
          <span nz-icon nzType="plus"></span> Novo lançamento
        </button>
      </div>

      <div class="filtros">
        <input nz-input placeholder="Buscar descrição…" [(ngModel)]="busca" (ngModelChange)="aplicarFiltros()" />
        <nz-select [(ngModel)]="filtroAno" (ngModelChange)="aplicarFiltros()" nzPlaceHolder="Ano" nzAllowClear>
          @for (a of anos(); track a) { <nz-option [nzValue]="a" [nzLabel]="'' + a" /> }
        </nz-select>
        <nz-select [(ngModel)]="filtroMes" (ngModelChange)="aplicarFiltros()" nzPlaceHolder="Mês" nzAllowClear>
          @for (m of meses; track m.valor) { <nz-option [nzValue]="m.valor" [nzLabel]="m.nome" /> }
        </nz-select>
        <nz-select [(ngModel)]="filtroCategoria" (ngModelChange)="aplicarFiltros()" nzPlaceHolder="Categoria" nzAllowClear>
          @for (c of categorias(); track c.id) { <nz-option [nzValue]="c.id" [nzLabel]="c.nome" /> }
        </nz-select>
      </div>

      @if (carregando()) {
        <app-loading mensagem="Carregando lançamentos…" />
      } @else if (erro(); as msg) {
        <app-error-state [mensagem]="msg" (tentarNovamente)="carregar()" />
      } @else {
        <nz-table
          #tabela
          [nzData]="itens()"
          [nzFrontPagination]="false"
          [nzTotal]="total()"
          [nzPageSize]="tamanhoPagina"
          [nzPageIndex]="pagina"
          [nzShowSizeChanger]="true"
          (nzQueryParams)="aoMudarQuery($event)"
        >
          <thead>
            <tr>
              <th nzWidth="20%">Descrição</th>
              <th nzWidth="12%">Data</th>
              <th nzWidth="16%">Categoria</th>
              <th nzWidth="10%">Qtd</th>
              <th nzWidth="14%" nzAlign="right">Valor</th>
              <th nzWidth="14%">Viagem</th>
              <th nzWidth="150px" nzAlign="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (l of tabela.data; track l.id) {
              <tr>
                <td>{{ l.descricao }}</td>
                <td>{{ l.data_despesa | date: 'dd/MM/yyyy' }}</td>
                <td>{{ nomeCategoria(l.categoria_id) }}</td>
                <td>{{ l.quantidade }}</td>
                <td nzAlign="right">{{ l.valor_total_centavos | moeda }}</td>
                <td>{{ nomeViagem(l.viagem_id) }}</td>
                <td nzAlign="right">
                  <button nz-button nzType="link" nzSize="small" (click)="editar(l)">
                    <span nz-icon nzType="edit"></span> Editar
                  </button>
                  <button nz-button nzType="link" nzSize="small" nzDanger (click)="excluir(l)">
                    <span nz-icon nzType="delete"></span> Excluir
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7"><app-empty-state mensagem="Nenhum lançamento encontrado." /></td>
              </tr>
            }
          </tbody>
        </nz-table>
      }

      <nz-modal
        [nzVisible]="modalVisivel"
        [nzTitle]="editando() ? 'Editar lançamento' : 'Novo lançamento'"
        (nzOnCancel)="modalVisivel = false"
        [nzFooter]="modalFooter"
        nzWidth="640px"
      >
        <form nz-form [formGroup]="form" nzLayout="vertical">
          <div class="md-grid md-grid--cols-2">
            <nz-form-item nzSpan="2">
              <nz-form-label nzRequired>Descrição</nz-form-label>
              <input nz-input formControlName="descricao" placeholder="Ex.: Passagem de ônibus — ida" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Data da despesa</nz-form-label>
              <nz-date-picker formControlName="data_despesa" nzFormat="dd/MM/yyyy" style="width:100%" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Categoria</nz-form-label>
              <nz-select formControlName="categoria_id" nzPlaceHolder="Selecione">
                @for (c of categorias(); track c.id) {
                  <nz-option [nzValue]="c.id" [nzLabel]="c.nome" />
                }
              </nz-select>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Forma de pagamento</nz-form-label>
              <nz-select formControlName="forma_pagamento_id" nzPlaceHolder="Opcional" nzAllowClear>
                @for (f of formas(); track f.id) {
                  <nz-option [nzValue]="f.id" [nzLabel]="f.nome" />
                }
              </nz-select>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Viagem</nz-form-label>
              <nz-select formControlName="viagem_id" nzPlaceHolder="Opcional" nzAllowClear>
                @for (v of viagens(); track v.id) {
                  <nz-option [nzValue]="v.id" [nzLabel]="v.identificador" />
                }
              </nz-select>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Hotel</nz-form-label>
              <nz-select formControlName="hotel_id" nzPlaceHolder="Opcional" nzAllowClear>
                @for (h of hoteis(); track h.id) {
                  <nz-option [nzValue]="h.id" [nzLabel]="h.nome" />
                }
              </nz-select>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Quantidade</nz-form-label>
              <nz-input-number formControlName="quantidade" [nzMin]="0.01" [nzStep]="1" style="width:100%" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Valor unitário (R$)</nz-form-label>
              <nz-input-number
                formControlName="valor_unitario"
                [nzMin]="0"
                [nzPrecision]="2"
                [nzFormatter]="fmtMoeda"
                [nzParser]="parseMoeda"
                style="width:100%"
              />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Origem</nz-form-label>
              <input nz-input formControlName="origem" placeholder="Jaú" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Destino</nz-form-label>
              <input nz-input formControlName="destino" placeholder="São Paulo" />
            </nz-form-item>
            <nz-form-item nzSpan="2">
              <nz-form-label>Observações</nz-form-label>
              <textarea nz-input formControlName="observacoes" rows="2"></textarea>
            </nz-form-item>
          </div>
        </form>
      </nz-modal>
      <ng-template #modalFooter>
        <button
          nz-button
          nzType="primary"
          [nzLoading]="salvando()"
          [disabled]="form.invalid"
          (click)="salvar()"
        >
          Salvar
        </button>
        <button nz-button (click)="modalVisivel = false">Cancelar</button>
      </ng-template>
    </div>
  `,
  styles: `
    .lancamentos__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .lancamentos__header h1 { margin: 0; }
    .filtros {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .filtros input { max-width: 280px; }
    .filtros nz-select { min-width: 160px; }
  `,
})
export class Lancamentos implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly lancamentos = inject(LancamentoService);
  private readonly categoriasSvc = inject(CategoriaService);
  private readonly formasSvc = inject(FormaPagamentoService);
  private readonly viagensSvc = inject(ViagemService);
  private readonly hoteisSvc = inject(HotelService);
  private readonly dominiosSvc = inject(DominioService);
  private readonly modal = inject(NzModalService);

  readonly itens = signal<Lancamento[]>([]);
  readonly categorias = signal<CategoriaDespesa[]>([]);
  readonly formas = signal<FormaPagamento[]>([]);
  readonly viagens = signal<Viagem[]>([]);
  readonly hoteis = signal<Hotel[]>([]);
  readonly anos = signal<number[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly salvando = signal(false);
  readonly editando = signal<Lancamento | null>(null);
  readonly total = signal(0);

  modalVisivel = false;
  pagina = 1;
  tamanhoPagina = 10;
  busca = '';
  filtroAno: number | null = null;
  filtroMes: number | null = null;
  filtroCategoria: string | null = null;

  readonly meses = [
    { valor: 1, nome: 'Janeiro' }, { valor: 2, nome: 'Fevereiro' }, { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' }, { valor: 5, nome: 'Maio' }, { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' }, { valor: 8, nome: 'Agosto' }, { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' }, { valor: 11, nome: 'Novembro' }, { valor: 12, nome: 'Dezembro' },
  ];

  readonly fmtMoeda = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  readonly parseMoeda = (v: string) =>
    Number(v.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0;

  readonly form = this.fb.nonNullable.group({
    descricao: ['', Validators.required],
    data_despesa: [null as Date | null, Validators.required],
    categoria_id: [null as string | null, Validators.required],
    forma_pagamento_id: [null as string | null],
    viagem_id: [null as string | null],
    hotel_id: [null as string | null],
    quantidade: [1, [Validators.required, Validators.min(0.01)]],
    valor_unitario: [0, [Validators.required, Validators.min(0)]],
    origem: [''],
    destino: [''],
    observacoes: [''],
  });

  private dominioId = '';

  ngOnInit(): void {
    const anoAtual = new Date().getFullYear();
    this.anos.set([anoAtual, anoAtual - 1, anoAtual - 2]);
    forkJoin({
      categorias: this.categoriasSvc.listar(),
      formas: this.formasSvc.listar(),
      viagens: this.viagensSvc.listar(),
      hoteis: this.hoteisSvc.listar(),
      dominios: this.dominiosSvc.listar(),
    }).subscribe({
      next: ({ categorias, formas, viagens, hoteis, dominios }) => {
        this.categorias.set(categorias.filter((c) => c.ativo));
        this.formas.set(formas.filter((f) => f.ativo));
        this.viagens.set(viagens);
        this.hoteis.set(hoteis.filter((h) => h.ativo));
        this.dominioId =
          dominios.find((d) => d.slug === 'deslocamento-trabalho')?.id ?? dominios[0]?.id ?? '';
        this.carregar();
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.lancamentos
      .listar(
        {
          dominioId: this.dominioId || undefined,
          ano: this.filtroAno ?? undefined,
          mes: this.filtroMes ?? undefined,
          categoriaId: this.filtroCategoria ?? undefined,
          busca: this.busca || undefined,
        },
        { pagina: this.pagina, tamanhoPagina: this.tamanhoPagina },
      )
      .subscribe({
        next: (pagina) => {
          this.itens.set(pagina.dados);
          this.total.set(pagina.total);
          this.carregando.set(false);
        },
        error: (e: Error) => {
          this.erro.set(e.message);
          this.carregando.set(false);
        },
      });
  }

  aplicarFiltros(): void {
    this.pagina = 1;
    this.carregar();
  }

  aoMudarQuery(params: NzTableQueryParams): void {
    this.pagina = params.pageIndex ?? 1;
    this.tamanhoPagina = params.pageSize ?? 10;
    this.carregar();
  }

  nomeCategoria(id: string): string {
    return this.categorias().find((c) => c.id === id)?.nome ?? '—';
  }

  nomeViagem(id: string | null): string {
    if (!id) return '—';
    return this.viagens().find((v) => v.id === id)?.identificador ?? '—';
  }

  abrirModal(): void {
    this.editando.set(null);
    this.form.reset({
      descricao: '', data_despesa: null, categoria_id: null,
      forma_pagamento_id: null, viagem_id: null, hotel_id: null,
      quantidade: 1, valor_unitario: 0, origem: '', destino: '', observacoes: '',
    });
    this.modalVisivel = true;
  }

  editar(l: Lancamento): void {
    this.editando.set(l);
    this.form.patchValue({
      descricao: l.descricao,
      data_despesa: new Date(l.data_despesa),
      categoria_id: l.categoria_id,
      forma_pagamento_id: l.forma_pagamento_id,
      viagem_id: l.viagem_id,
      hotel_id: l.hotel_id,
      quantidade: Number(l.quantidade),
      valor_unitario: l.valor_unitario_centavos / 100,
      origem: l.origem ?? '',
      destino: l.destino ?? '',
      observacoes: l.observacoes ?? '',
    });
    this.modalVisivel = true;
  }

  salvar(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload: Partial<Lancamento> = {
      dominio_id: this.dominioId,
      descricao: v.descricao,
      data_despesa: (v.data_despesa as Date).toISOString().slice(0, 10),
      categoria_id: v.categoria_id!,
      forma_pagamento_id: v.forma_pagamento_id,
      viagem_id: v.viagem_id,
      hotel_id: v.hotel_id,
      quantidade: v.quantidade,
      valor_unitario_centavos: Math.round(v.valor_unitario * 100),
      origem: v.origem || null,
      destino: v.destino || null,
      observacoes: v.observacoes || null,
    };

    this.salvando.set(true);
    const atual = this.editando();
    const req$ = atual
      ? this.lancamentos.atualizar(atual.id, payload)
      : this.lancamentos.criar(payload);
    req$.subscribe({
      next: () => {
        this.salvando.set(false);
        this.modalVisivel = false;
        this.carregar();
      },
      error: (e: Error) => {
        this.salvando.set(false);
        this.erro.set(e.message);
      },
    });
  }

  excluir(l: Lancamento): void {
    this.modal.confirm({
      nzTitle: 'Excluir lançamento',
      nzContent: `Excluir "${l.descricao}"? Esta ação não pode ser desfeita.`,
      nzOkText: 'Excluir',
      nzOkDanger: true,
      nzOnOk: () =>
        new Promise<void>((resolve) => {
          this.lancamentos.remover(l.id).subscribe({
            next: () => {
              this.carregar();
              resolve();
            },
            error: (e: Error) => {
              this.erro.set(e.message);
              resolve();
            },
          });
        }),
    });
  }
}
