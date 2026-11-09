import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { Viagem, ViagemResumo } from '../../core/models/viagem.model';
import { Hospedagem } from '../../core/models/hospedagem.model';
import { StatusViagem } from '../../core/models/status-viagem.model';
import { Hotel } from '../../core/models/hotel.model';
import { ViagemService } from '../../core/services/viagem.service';
import { HospedagemService } from '../../core/services/hospedagem.service';
import { StatusViagemService } from '../../core/services/status-viagem.service';
import { HotelService } from '../../core/services/hotel.service';
import { DominioService } from '../../core/services/dominio.service';
import { Loading } from '../../shared/components/loading/loading';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { MoedaPipe } from '../../shared/pipes/moeda.pipe';

@Component({
  selector: 'app-viagens',
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
    NzCardModule,
    NzDescriptionsModule,
    Loading,
    ErrorState,
    EmptyState,
    MoedaPipe,
  ],
  template: `
    <div class="viagens">
      <div class="viagens__header">
        <h1>Viagens</h1>
        <button nz-button nzType="primary" (click)="abrirModalViagem()">
          <span nz-icon nzType="plus"></span> Nova viagem
        </button>
      </div>

      @if (carregando()) {
        <app-loading mensagem="Carregando viagens…" />
      } @else if (erro(); as msg) {
        <app-error-state [mensagem]="msg" (tentarNovamente)="carregar()" />
      } @else {
        <nz-table #tabela [nzData]="itens()" [nzLoading]="carregando()">
          <thead>
            <tr>
              <th>Identificador</th>
              <th>Origem → Destino</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Dias</th>
              <th>Status</th>
              <th nzWidth="220px" nzAlign="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (v of tabela.data; track v.id) {
              <tr>
                <td>{{ v.identificador }}</td>
                <td>{{ v.origem }} → {{ v.destino }}</td>
                <td>{{ v.data_inicio | date: 'dd/MM/yyyy' }}</td>
                <td>{{ v.data_fim | date: 'dd/MM/yyyy' }}</td>
                <td>{{ v.dias }}</td>
                <td>{{ nomeStatus(v.status_id) }}</td>
                <td nzAlign="right">
                  <button nz-button nzType="link" nzSize="small" (click)="abrirDetalhe(v)">
                    <span nz-icon nzType="eye"></span> Detalhes
                  </button>
                  <button nz-button nzType="link" nzSize="small" (click)="editar(v)">
                    <span nz-icon nzType="edit"></span>
                  </button>
                  <button nz-button nzType="link" nzSize="small" nzDanger (click)="excluir(v)">
                    <span nz-icon nzType="delete"></span>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7"><app-empty-state mensagem="Nenhuma viagem encontrada." /></td></tr>
            }
          </tbody>
        </nz-table>
      }

      <!-- Modal viagem -->
      <nz-modal
        [nzVisible]="modalViagem"
        [nzTitle]="editandoViagem() ? 'Editar viagem' : 'Nova viagem'"
        (nzOnCancel)="modalViagem = false"
        [nzFooter]="footerViagem"
        nzWidth="560px"
      >
        <form nz-form [formGroup]="formViagem" nzLayout="vertical">
          <div class="md-grid md-grid--cols-2">
            <nz-form-item nzSpan="2">
              <nz-form-label nzRequired>Identificador</nz-form-label>
              <input nz-input formControlName="identificador" placeholder="Ex.: Viagem 1" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Origem</nz-form-label>
              <input nz-input formControlName="origem" placeholder="Jaú" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Destino</nz-form-label>
              <input nz-input formControlName="destino" placeholder="São Paulo" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Data início</nz-form-label>
              <nz-date-picker formControlName="data_inicio" nzFormat="dd/MM/yyyy" style="width:100%" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Data fim</nz-form-label>
              <nz-date-picker formControlName="data_fim" nzFormat="dd/MM/yyyy" style="width:100%" />
            </nz-form-item>
            <nz-form-item nzSpan="2">
              <nz-form-label>Status</nz-form-label>
              <nz-select formControlName="status_id">
                @for (s of status(); track s.id) {
                  <nz-option [nzValue]="s.id" [nzLabel]="s.nome" />
                }
              </nz-select>
            </nz-form-item>
            <nz-form-item nzSpan="2">
              <nz-form-label>Observações</nz-form-label>
              <textarea nz-input formControlName="observacoes" rows="2"></textarea>
            </nz-form-item>
          </div>
        </form>
      </nz-modal>
      <ng-template #footerViagem>
        <button nz-button nzType="primary" [nzLoading]="salvando()" [disabled]="formViagem.invalid" (click)="salvarViagem()">Salvar</button>
        <button nz-button (click)="modalViagem = false">Cancelar</button>
      </ng-template>

      <!-- Modal detalhe: resumo + hospedagens -->
      <nz-modal
        [nzVisible]="modalDetalhe"
        [nzTitle]="detalhe()?.identificador ?? 'Viagem'"
        (nzOnCancel)="modalDetalhe = false"
        [nzFooter]="null"
        nzWidth="720px"
      >
        @if (detalhe(); as v) {
          @if (resumo(); as r) {
            <nz-descriptions nzBordered [nzColumn]="2" nzSize="small">
              <nz-descriptions-item nzTitle="Diárias">{{ r.total_diarias }}</nz-descriptions-item>
              <nz-descriptions-item nzTitle="Hospedagem">{{ r.total_hospedagem_centavos | moeda }}</nz-descriptions-item>
              <nz-descriptions-item nzTitle="Lançamentos">{{ r.total_lancamentos_centavos | moeda }}</nz-descriptions-item>
              <nz-descriptions-item nzTitle="Custo total"><strong>{{ r.custo_total_viagem_centavos | moeda }}</strong></nz-descriptions-item>
            </nz-descriptions>
          }

          <div class="hospedagens__header">
            <h3>Hospedagens</h3>
            <button nz-button nzType="primary" nzSize="small" (click)="abrirModalHospedagem()">
              <span nz-icon nzType="plus"></span> Adicionar
            </button>
          </div>
          <nz-table #tabelaHosp [nzData]="hospedagens()" [nzShowPagination]="false" nzSize="small">
            <thead>
              <tr><th>Hotel</th><th>Check-in</th><th>Check-out</th><th>Diárias</th><th nzAlign="right">Total</th><th></th></tr>
            </thead>
            <tbody>
              @for (h of tabelaHosp.data; track h.id) {
                <tr>
                  <td>{{ nomeHotel(h.hotel_id) }}</td>
                  <td>{{ h.check_in | date: 'dd/MM/yyyy' }}</td>
                  <td>{{ h.check_out | date: 'dd/MM/yyyy' }}</td>
                  <td>{{ h.diarias }}</td>
                  <td nzAlign="right">{{ h.valor_total_centavos | moeda }}</td>
                  <td nzAlign="right">
                    <button nz-button nzType="link" nzSize="small" nzDanger (click)="excluirHospedagem(h)">
                      <span nz-icon nzType="delete"></span>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6"><app-empty-state mensagem="Nenhuma hospedagem." /></td></tr>
              }
            </tbody>
          </nz-table>
        }
      </nz-modal>

      <!-- Modal hospedagem -->
      <nz-modal
        [nzVisible]="modalHospedagem"
        nzTitle="Nova hospedagem"
        (nzOnCancel)="modalHospedagem = false"
        [nzFooter]="footerHospedagem"
        nzWidth="480px"
      >
        <form nz-form [formGroup]="formHospedagem" nzLayout="vertical">
          <nz-form-item>
            <nz-form-label>Hotel</nz-form-label>
            <nz-select formControlName="hotel_id" nzPlaceHolder="Selecione o hotel" nzAllowClear>
              @for (h of hoteis(); track h.id) {
                <nz-option [nzValue]="h.id" [nzLabel]="h.nome" />
              }
            </nz-select>
          </nz-form-item>
          <div class="md-grid md-grid--cols-2">
            <nz-form-item>
              <nz-form-label nzRequired>Check-in</nz-form-label>
              <nz-date-picker formControlName="check_in" nzFormat="dd/MM/yyyy" style="width:100%" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Check-out</nz-form-label>
              <nz-date-picker formControlName="check_out" nzFormat="dd/MM/yyyy" style="width:100%" />
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Valor diária (R$)</nz-form-label>
              <nz-input-number
                formControlName="valor_diaria"
                [nzMin]="0"
                [nzPrecision]="2"
                style="width:100%"
              />
            </nz-form-item>
          </div>
          <nz-form-item>
            <nz-form-label>Observações</nz-form-label>
            <input nz-input formControlName="observacoes" />
          </nz-form-item>
        </form>
      </nz-modal>
      <ng-template #footerHospedagem>
        <button nz-button nzType="primary" [nzLoading]="salvando()" [disabled]="formHospedagem.invalid" (click)="salvarHospedagem()">Salvar</button>
        <button nz-button (click)="modalHospedagem = false">Cancelar</button>
      </ng-template>
    </div>
  `,
  styles: `
    .viagens__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .viagens__header h1 { margin: 0; }
    .hospedagens__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0 8px;
    }
    .hospedagens__header h3 { margin: 0; }
  `,
})
export class Viagens implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly viagensSvc = inject(ViagemService);
  private readonly hospedagensSvc = inject(HospedagemService);
  private readonly statusSvc = inject(StatusViagemService);
  private readonly hoteisSvc = inject(HotelService);
  private readonly dominiosSvc = inject(DominioService);
  private readonly modal = inject(NzModalService);

  readonly itens = signal<Viagem[]>([]);
  readonly status = signal<StatusViagem[]>([]);
  readonly hoteis = signal<Hotel[]>([]);
  readonly hospedagens = signal<Hospedagem[]>([]);
  readonly detalhe = signal<Viagem | null>(null);
  readonly resumo = signal<ViagemResumo | null>(null);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly salvando = signal(false);
  readonly editandoViagem = signal<Viagem | null>(null);

  modalViagem = false;
  modalDetalhe = false;
  modalHospedagem = false;

  private dominioId = '';

  readonly formViagem = this.fb.nonNullable.group({
    identificador: ['', Validators.required],
    origem: [''],
    destino: [''],
    data_inicio: [null as Date | null, Validators.required],
    data_fim: [null as Date | null, Validators.required],
    status_id: [1 as number | null],
    observacoes: [''],
  });

  readonly formHospedagem = this.fb.nonNullable.group({
    hotel_id: [null as string | null],
    check_in: [null as Date | null, Validators.required],
    check_out: [null as Date | null, Validators.required],
    valor_diaria: [0, [Validators.required, Validators.min(0)]],
    observacoes: [''],
  });

  ngOnInit(): void {
    forkJoin({
      viagens: this.viagensSvc.listar(),
      status: this.statusSvc.listar(),
      hoteis: this.hoteisSvc.listar(),
      dominios: this.dominiosSvc.listar(),
    }).subscribe({
      next: ({ viagens, status, hoteis, dominios }) => {
        this.status.set(status.filter((s) => s.ativo).sort((a, b) => a.ordem - b.ordem));
        this.hoteis.set(hoteis.filter((h) => h.ativo));
        this.dominioId =
          dominios.find((d) => d.slug === 'deslocamento-trabalho')?.id ?? dominios[0]?.id ?? '';
        this.itens.set(viagens.filter((v) => v.dominio_id === this.dominioId));
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
    this.viagensSvc.listar({ filtros: { dominio_id: this.dominioId } }).subscribe({
      next: (dados) => {
        this.itens.set(dados);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  nomeStatus(id: number): string {
    return this.status().find((s) => s.id === id)?.nome ?? '—';
  }

  nomeHotel(id: string | null): string {
    if (!id) return '—';
    return this.hoteis().find((h) => h.id === id)?.nome ?? '—';
  }

  abrirModalViagem(): void {
    this.editandoViagem.set(null);
    this.formViagem.reset({
      identificador: '', origem: '', destino: '',
      data_inicio: null, data_fim: null, status_id: 3, observacoes: '',
    });
    this.modalViagem = true;
  }

  editar(v: Viagem): void {
    this.editandoViagem.set(v);
    this.formViagem.patchValue({
      identificador: v.identificador,
      origem: v.origem ?? '',
      destino: v.destino ?? '',
      data_inicio: new Date(v.data_inicio),
      data_fim: new Date(v.data_fim),
      status_id: v.status_id,
      observacoes: v.observacoes ?? '',
    });
    this.modalViagem = true;
  }

  salvarViagem(): void {
    if (this.formViagem.invalid) return;
    const v = this.formViagem.getRawValue();
    const payload: Partial<Viagem> = {
      dominio_id: this.dominioId,
      identificador: v.identificador,
      origem: v.origem || null,
      destino: v.destino || null,
      data_inicio: (v.data_inicio as Date).toISOString().slice(0, 10),
      data_fim: (v.data_fim as Date).toISOString().slice(0, 10),
      status_id: v.status_id ?? 1,
      observacoes: v.observacoes || null,
    };
    this.salvando.set(true);
    const atual = this.editandoViagem();
    const req$ = atual ? this.viagensSvc.atualizar(atual.id, payload) : this.viagensSvc.criar(payload);
    req$.subscribe({
      next: () => {
        this.salvando.set(false);
        this.modalViagem = false;
        this.carregar();
      },
      error: (e: Error) => {
        this.salvando.set(false);
        this.erro.set(e.message);
      },
    });
  }

  excluir(v: Viagem): void {
    this.modal.confirm({
      nzTitle: 'Excluir viagem',
      nzContent: `Excluir "${v.identificador}" e suas hospedagens?`,
      nzOkText: 'Excluir',
      nzOkDanger: true,
      nzOnOk: () =>
        new Promise<void>((resolve) => {
          this.viagensSvc.remover(v.id).subscribe({
            next: () => { this.carregar(); resolve(); },
            error: (e: Error) => { this.erro.set(e.message); resolve(); },
          });
        }),
    });
  }

  abrirDetalhe(v: Viagem): void {
    this.detalhe.set(v);
    this.resumo.set(null);
    this.modalDetalhe = true;
    this.viagensSvc.resumo(v.id).subscribe({ next: (r) => this.resumo.set(r) });
    this.hospedagensSvc.listar({ filtros: { viagem_id: v.id } }).subscribe({
      next: (h) => this.hospedagens.set(h),
    });
  }

  abrirModalHospedagem(): void {
    this.formHospedagem.reset({ hotel_id: null, check_in: null, check_out: null, valor_diaria: 0, observacoes: '' });
    this.modalHospedagem = true;
  }

  salvarHospedagem(): void {
    const v = this.detalhe();
    if (!v || this.formHospedagem.invalid) return;
    const f = this.formHospedagem.getRawValue();
    const payload: Partial<Hospedagem> = {
      viagem_id: v.id,
      hotel_id: f.hotel_id,
      check_in: (f.check_in as Date).toISOString().slice(0, 10),
      check_out: (f.check_out as Date).toISOString().slice(0, 10),
      valor_diaria_centavos: Math.round(f.valor_diaria * 100),
      observacoes: f.observacoes || null,
    };
    this.salvando.set(true);
    this.hospedagensSvc.criar(payload).subscribe({
      next: () => {
        this.salvando.set(false);
        this.modalHospedagem = false;
        this.abrirDetalhe(v);
        this.viagensSvc.resumo(v.id).subscribe({ next: (r) => this.resumo.set(r) });
      },
      error: (e: Error) => {
        this.salvando.set(false);
        this.erro.set(e.message);
      },
    });
  }

  excluirHospedagem(h: Hospedagem): void {
    const v = this.detalhe();
    this.hospedagensSvc.remover(h.id).subscribe({
      next: () => {
        if (v) {
          this.hospedagensSvc.listar({ filtros: { viagem_id: v.id } }).subscribe({
            next: (lista) => this.hospedagens.set(lista),
          });
          this.viagensSvc.resumo(v.id).subscribe({ next: (r) => this.resumo.set(r) });
        }
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
