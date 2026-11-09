import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CategoriaDespesa } from '../../core/models/categoria-despesa.model';
import { FormaPagamento } from '../../core/models/forma-pagamento.model';
import { Hotel } from '../../core/models/hotel.model';
import { StatusViagem } from '../../core/models/status-viagem.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { FormaPagamentoService } from '../../core/services/forma-pagamento.service';
import { HotelService } from '../../core/services/hotel.service';
import { StatusViagemService } from '../../core/services/status-viagem.service';
import { DominioService } from '../../core/services/dominio.service';
import { Loading } from '../../shared/components/loading/loading';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

type Entidade = 'categoria' | 'forma' | 'hotel' | 'status';

interface Edicao {
  entidade: Entidade;
  id?: string | number;
}

@Component({
  selector: 'app-configuracoes',
  imports: [
    ReactiveFormsModule,
    NzTabsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzSwitchModule,
    NzFormModule,
    NzModalModule,
    Loading,
    ErrorState,
    EmptyState,
  ],
  template: `
    <div class="config">
      <h1>Configurações</h1>

      @if (erro(); as msg) {
        <app-error-state [mensagem]="msg" (tentarNovamente)="carregar()" />
      } @else if (carregando()) {
        <app-loading mensagem="Carregando configurações…" />
      } @else {
        <nz-tabs>
          <!-- CATEGORIAS -->
          <nz-tab nzTitle="Categorias de despesa">
            <button nz-button nzType="primary" nzSize="small" (click)="nova('categoria')">
              <span nz-icon nzType="plus"></span> Nova categoria
            </button>
            <nz-table #tabCat [nzData]="categorias()" [nzShowPagination]="false" nzSize="small">
              <thead><tr><th>Nome</th><th>Slug</th><th>Ordem</th><th>Ativo</th><th nzWidth="120px"></th></tr></thead>
              <tbody>
                @for (c of tabCat.data; track c.id) {
                  <tr>
                    <td>{{ c.nome }}</td><td>{{ c.slug }}</td><td>{{ c.ordem }}</td>
                    <td>{{ c.ativo ? 'Sim' : 'Não' }}</td>
                    <td nzAlign="right">
                      <button nz-button nzType="link" nzSize="small" (click)="editar('categoria', c)"><span nz-icon nzType="edit"></span></button>
                      <button nz-button nzType="link" nzSize="small" nzDanger (click)="excluir('categoria', c.id, c.nome)"><span nz-icon nzType="delete"></span></button>
                    </td>
                  </tr>
                } @empty { <tr><td colspan="5"><app-empty-state /></td></tr> }
              </tbody>
            </nz-table>
          </nz-tab>

          <!-- FORMAS DE PAGAMENTO -->
          <nz-tab nzTitle="Formas de pagamento">
            <button nz-button nzType="primary" nzSize="small" (click)="nova('forma')">
              <span nz-icon nzType="plus"></span> Nova forma
            </button>
            <nz-table #tabFormas [nzData]="formas()" [nzShowPagination]="false" nzSize="small">
              <thead><tr><th>Nome</th><th>Tipo</th><th>Ativo</th><th nzWidth="120px"></th></tr></thead>
              <tbody>
                @for (f of tabFormas.data; track f.id) {
                  <tr>
                    <td>{{ f.nome }}</td><td>{{ f.tipo }}</td><td>{{ f.ativo ? 'Sim' : 'Não' }}</td>
                    <td nzAlign="right">
                      <button nz-button nzType="link" nzSize="small" (click)="editar('forma', f)"><span nz-icon nzType="edit"></span></button>
                      <button nz-button nzType="link" nzSize="small" nzDanger (click)="excluir('forma', f.id, f.nome)"><span nz-icon nzType="delete"></span></button>
                    </td>
                  </tr>
                } @empty { <tr><td colspan="4"><app-empty-state /></td></tr> }
              </tbody>
            </nz-table>
          </nz-tab>

          <!-- HOTÉIS -->
          <nz-tab nzTitle="Hotéis">
            <button nz-button nzType="primary" nzSize="small" (click)="nova('hotel')">
              <span nz-icon nzType="plus"></span> Novo hotel
            </button>
            <nz-table #tabHoteis [nzData]="hoteis()" [nzShowPagination]="false" nzSize="small">
              <thead><tr><th>Nome</th><th>Cidade</th><th>Estado</th><th>Ativo</th><th nzWidth="120px"></th></tr></thead>
              <tbody>
                @for (h of tabHoteis.data; track h.id) {
                  <tr>
                    <td>{{ h.nome }}</td><td>{{ h.cidade }}</td><td>{{ h.estado }}</td>
                    <td>{{ h.ativo ? 'Sim' : 'Não' }}</td>
                    <td nzAlign="right">
                      <button nz-button nzType="link" nzSize="small" (click)="editar('hotel', h)"><span nz-icon nzType="edit"></span></button>
                      <button nz-button nzType="link" nzSize="small" nzDanger (click)="excluir('hotel', h.id, h.nome)"><span nz-icon nzType="delete"></span></button>
                    </td>
                  </tr>
                } @empty { <tr><td colspan="5"><app-empty-state /></td></tr> }
              </tbody>
            </nz-table>
          </nz-tab>

          <!-- STATUS DE VIAGEM -->
          <nz-tab nzTitle="Status de viagem">
            <button nz-button nzType="primary" nzSize="small" (click)="nova('status')">
              <span nz-icon nzType="plus"></span> Novo status
            </button>
            <nz-table #tabStatus [nzData]="status()" [nzShowPagination]="false" nzSize="small">
              <thead><tr><th>Nome</th><th>Slug</th><th>Ordem</th><th>Ativo</th><th nzWidth="120px"></th></tr></thead>
              <tbody>
                @for (s of tabStatus.data; track s.id) {
                  <tr>
                    <td>{{ s.nome }}</td><td>{{ s.slug }}</td><td>{{ s.ordem }}</td>
                    <td>{{ s.ativo ? 'Sim' : 'Não' }}</td>
                    <td nzAlign="right">
                      <button nz-button nzType="link" nzSize="small" (click)="editar('status', s)"><span nz-icon nzType="edit"></span></button>
                    </td>
                  </tr>
                } @empty { <tr><td colspan="5"><app-empty-state /></td></tr> }
              </tbody>
            </nz-table>
          </nz-tab>
        </nz-tabs>
      }

      <!-- Modal genérico de edição -->
      <nz-modal
        [nzVisible]="modalVisivel"
        [nzTitle]="tituloModal()"
        (nzOnCancel)="modalVisivel = false"
        [nzFooter]="footerModal"
        nzWidth="520px"
      >
        <form nz-form [formGroup]="form" nzLayout="vertical">
          @switch (edicao()?.entidade) {
            @case ('categoria') {
              <nz-form-item><nz-form-label nzRequired>Nome</nz-form-label>
                <input nz-input formControlName="nome" /></nz-form-item>
              <nz-form-item><nz-form-label>Slug</nz-form-label>
                <input nz-input formControlName="slug" placeholder="ex.: passagem-onibus" /></nz-form-item>
              <div class="md-grid md-grid--cols-2">
                <nz-form-item><nz-form-label>Ordem</nz-form-label>
                  <nz-input-number formControlName="ordem" [nzMin]="0" style="width:100%" /></nz-form-item>
                <nz-form-item><nz-form-label>Ativo</nz-form-label>
                  <nz-switch formControlName="ativo" /></nz-form-item>
              </div>
            }
            @case ('forma') {
              <nz-form-item><nz-form-label nzRequired>Nome</nz-form-label>
                <input nz-input formControlName="nome" placeholder="Ex.: Pix" /></nz-form-item>
              <nz-form-item><nz-form-label>Tipo</nz-form-label>
                <nz-select formControlName="tipo" nzAllowClear>
                  <nz-option nzValue="pix" nzLabel="Pix" />
                  <nz-option nzValue="credito" nzLabel="Crédito" />
                  <nz-option nzValue="debito" nzLabel="Débito" />
                  <nz-option nzValue="dinheiro" nzLabel="Dinheiro" />
                  <nz-option nzValue="boleto" nzLabel="Boleto" />
                </nz-select></nz-form-item>
              <nz-form-item><nz-form-label>Ativo</nz-form-label>
                <nz-switch formControlName="ativo" /></nz-form-item>
            }
            @case ('hotel') {
              <nz-form-item><nz-form-label nzRequired>Nome</nz-form-label>
                <input nz-input formControlName="nome" placeholder="Nome do hotel" /></nz-form-item>
              <nz-form-item><nz-form-label>Endereço</nz-form-label>
                <input nz-input formControlName="endereco" /></nz-form-item>
              <div class="md-grid md-grid--cols-2">
                <nz-form-item><nz-form-label>Cidade</nz-form-label>
                  <input nz-input formControlName="cidade" /></nz-form-item>
                <nz-form-item><nz-form-label>Estado</nz-form-label>
                  <input nz-input formControlName="estado" maxlength="2" /></nz-form-item>
              </div>
              <nz-form-item><nz-form-label>Ativo</nz-form-label>
                <nz-switch formControlName="ativo" /></nz-form-item>
            }
            @case ('status') {
              <nz-form-item><nz-form-label nzRequired>Nome</nz-form-label>
                <input nz-input formControlName="nome" placeholder="Ex.: Planejada" /></nz-form-item>
              <nz-form-item><nz-form-label>Slug</nz-form-label>
                <input nz-input formControlName="slug" placeholder="ex.: planejada" /></nz-form-item>
              <nz-form-item><nz-form-label>Ordem</nz-form-label>
                <nz-input-number formControlName="ordem" [nzMin]="0" style="width:100%" /></nz-form-item>
            }
          }
        </form>
      </nz-modal>
      <ng-template #footerModal>
        <button nz-button nzType="primary" [nzLoading]="salvando()" [disabled]="form.invalid" (click)="salvar()">Salvar</button>
        <button nz-button (click)="modalVisivel = false">Cancelar</button>
      </ng-template>
    </div>
  `,
  styles: `
    .config h1 { margin: 0 0 16px; }
    nz-tab { display: block; }
    button[nz-button][nzSize='small'] { margin-bottom: 12px; }
  `,
})
export class Configuracoes implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoriasSvc = inject(CategoriaService);
  private readonly formasSvc = inject(FormaPagamentoService);
  private readonly hoteisSvc = inject(HotelService);
  private readonly statusSvc = inject(StatusViagemService);
  private readonly dominiosSvc = inject(DominioService);
  private readonly modal = inject(NzModalService);

  readonly categorias = signal<CategoriaDespesa[]>([]);
  readonly formas = signal<FormaPagamento[]>([]);
  readonly hoteis = signal<Hotel[]>([]);
  readonly status = signal<StatusViagem[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly salvando = signal(false);
  readonly edicao = signal<Edicao | null>(null);

  modalVisivel = false;
  private dominioId = '';

  readonly form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    slug: [''],
    ordem: [0],
    ativo: [true],
    tipo: [null as string | null],
    endereco: [''],
    cidade: [''],
    estado: [''],
  });

  ngOnInit(): void {
    forkJoin({
      categorias: this.categoriasSvc.listar(),
      formas: this.formasSvc.listar(),
      hoteis: this.hoteisSvc.listar(),
      status: this.statusSvc.listar(),
      dominios: this.dominiosSvc.listar(),
    }).subscribe({
      next: ({ categorias, formas, hoteis, status, dominios }) => {
        this.dominioId =
          dominios.find((d) => d.slug === 'deslocamento-trabalho')?.id ?? dominios[0]?.id ?? '';
        this.categorias.set(categorias.filter((c) => c.dominio_id === this.dominioId));
        this.formas.set(formas);
        this.hoteis.set(hoteis);
        this.status.set(status);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  carregar(): void {
    this.carregando.set(true);
    forkJoin({
      categorias: this.categoriasSvc.listar(),
      formas: this.formasSvc.listar(),
      hoteis: this.hoteisSvc.listar(),
      status: this.statusSvc.listar(),
    }).subscribe({
      next: ({ categorias, formas, hoteis, status }) => {
        this.categorias.set(categorias.filter((c) => c.dominio_id === this.dominioId));
        this.formas.set(formas);
        this.hoteis.set(hoteis);
        this.status.set(status);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  nova(entidade: Entidade): void {
    this.edicao.set({ entidade });
    this.form.reset({ nome: '', slug: '', ordem: 0, ativo: true, tipo: null, endereco: '', cidade: '', estado: '' });
    this.modalVisivel = true;
  }

  editar(entidade: Entidade, item: CategoriaDespesa | FormaPagamento | Hotel | StatusViagem): void {
    this.edicao.set({ entidade, id: item.id });
    this.form.patchValue({
      nome: item.nome,
      slug: 'slug' in item ? item.slug : '',
      ordem: 'ordem' in item ? item.ordem : 0,
      ativo: 'ativo' in item ? item.ativo : true,
      tipo: 'tipo' in item ? item.tipo : null,
      endereco: 'endereco' in item ? (item.endereco ?? '') : '',
      cidade: 'cidade' in item ? (item.cidade ?? '') : '',
      estado: 'estado' in item ? (item.estado ?? '') : '',
    });
    this.modalVisivel = true;
  }

  tituloModal(): string {
    const mapa: Record<Entidade, string> = {
      categoria: 'Categoria de despesa',
      forma: 'Forma de pagamento',
      hotel: 'Hotel',
      status: 'Status de viagem',
    };
    return `${this.edicao()?.id ? 'Editar' : 'Nova'} ${mapa[this.edicao()?.entidade ?? 'categoria']}`;
  }

  salvar(): void {
    const ed = this.edicao();
    if (!ed || this.form.invalid) return;
    const v = this.form.getRawValue();
    this.salvando.set(true);

    const req$ = this.montarRequisicao(ed, v);
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

  private montarRequisicao(ed: Edicao, v: ReturnType<typeof this.form.getRawValue>): Observable<unknown> {
    const id = ed.id;
    switch (ed.entidade) {
      case 'categoria':
        return id
          ? this.categoriasSvc.atualizar(String(id), {
              nome: v.nome, slug: v.slug || v.nome.toLowerCase().replace(/\s+/g, '-'),
              ordem: v.ordem, ativo: v.ativo,
            } as Partial<CategoriaDespesa>)
          : this.categoriasSvc.criar({
              dominio_id: this.dominioId, nome: v.nome,
              slug: v.slug || v.nome.toLowerCase().replace(/\s+/g, '-'),
              ordem: v.ordem, ativo: v.ativo,
            } as Partial<CategoriaDespesa>);
      case 'forma':
        return id
          ? this.formasSvc.atualizar(String(id), { nome: v.nome, tipo: v.tipo, ativo: v.ativo } as Partial<FormaPagamento>)
          : this.formasSvc.criar({ nome: v.nome, tipo: v.tipo, ativo: v.ativo } as Partial<FormaPagamento>);
      case 'hotel':
        return id
          ? this.hoteisSvc.atualizar(String(id), {
              nome: v.nome, endereco: v.endereco || null, cidade: v.cidade || null,
              estado: v.estado || null, ativo: v.ativo,
            } as Partial<Hotel>)
          : this.hoteisSvc.criar({
              nome: v.nome, endereco: v.endereco || null, cidade: v.cidade || null,
              estado: v.estado || null, ativo: v.ativo,
            } as Partial<Hotel>);
      case 'status':
        return id
          ? this.statusSvc.atualizar(Number(id), {
              nome: v.nome, slug: v.slug || v.nome.toLowerCase().replace(/\s+/g, '-'),
              ordem: v.ordem,
            } as Partial<StatusViagem>)
          : this.statusSvc.criar({
              nome: v.nome, slug: v.slug || v.nome.toLowerCase().replace(/\s+/g, '-'),
              ordem: v.ordem, ativo: true,
            } as Partial<StatusViagem>);
    }
  }

  excluir(entidade: Entidade, id: string | number, nome: string): void {
    this.modal.confirm({
      nzTitle: 'Excluir registro',
      nzContent: `Excluir "${nome}"?`,
      nzOkText: 'Excluir',
      nzOkDanger: true,
      nzOnOk: () =>
        new Promise<void>((resolve) => {
          const req$ =
            entidade === 'categoria' ? this.categoriasSvc.remover(id)
            : entidade === 'forma' ? this.formasSvc.remover(id)
            : entidade === 'hotel' ? this.hoteisSvc.remover(id)
            : this.statusSvc.remover(id);
          req$.subscribe({
            next: () => { this.carregar(); resolve(); },
            error: (e: Error) => { this.erro.set(e.message); resolve(); },
          });
        }),
    });
  }
}
