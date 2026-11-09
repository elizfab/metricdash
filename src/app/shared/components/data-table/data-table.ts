import { Component, TemplateRef, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface ColunaTabela {
  chave: string;
  titulo: string;
  largura?: string;
  alinhar?: 'left' | 'center' | 'right';
  /** template customizado da célula (contexto: { $implicit: linha }) */
  template?: TemplateRef<unknown>;
}

export interface AcaoTabela {
  chave: string;
  rotulo: string;
  icone: string;
  perigo?: boolean;
}

/**
 * Tabela CRUD genérica sobre nz-table com paginação server-side.
 * Uso: <app-data-table [linhas]="itens" [colunas]="cols" [total]="total"
 *       [pagina]="pagina" [tamanhoPagina]="tam" [carregando]="loading"
 *       [acoes]="acoes" (queryParams)="..." (acao)="..." />
 */
@Component({
  selector: 'app-data-table',
  imports: [NzTableModule, NzButtonModule, NzIconModule, NgTemplateOutlet],
  template: `
    <nz-table
      #tabela
      [nzData]="linhas()"
      [nzLoading]="carregando()"
      [nzFrontPagination]="false"
      [nzTotal]="total()"
      [nzPageSize]="tamanhoPagina()"
      [nzPageIndex]="pagina()"
      [nzShowSizeChanger]="true"
      [nzShowTotal]="rodapeTotal"
      (nzQueryParams)="queryParams.emit($event)"
    >
      <thead>
        <tr>
          @for (col of colunas(); track col.chave) {
            <th [nzWidth]="col.largura" [nzAlign]="col.alinhar ?? 'left'">
              {{ col.titulo }}
            </th>
          }
          @if (acoes().length > 0) {
            <th nzWidth="140px" nzAlign="right">Ações</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (linha of tabela.data; track $index) {
          <tr>
            @for (col of colunas(); track col.chave) {
              <td [nzAlign]="col.alinhar ?? 'left'">
                @if (col.template) {
                  <ng-container
                    [ngTemplateOutlet]="col.template"
                    [ngTemplateOutletContext]="{ $implicit: linha }"
                  />
                } @else {
                  {{ linha[col.chave] }}
                }
              </td>
            }
            @if (acoes().length > 0) {
              <td nzAlign="right">
                @for (acao of acoes(); track acao.chave) {
                  <button
                    nz-button
                    nzType="link"
                    nzSize="small"
                    [nzDanger]="acao.perigo"
                    (click)="executarAcao(acao.chave, linha)"
                  >
                    <span nz-icon [nzType]="acao.icone"></span>
                    {{ acao.rotulo }}
                  </button>
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </nz-table>
    <ng-template #rodapeTotal let-range="range" let-total>
      {{ range[0] }}-{{ range[1] }} de {{ total }} registros
    </ng-template>
  `,
  styles: `
    :host { display: block; }
  `,
})
export class DataTable<T extends Record<string, unknown>> {
  readonly linhas = input.required<T[]>();
  readonly colunas = input.required<ColunaTabela[]>();
  readonly acoes = input<AcaoTabela[]>([]);
  readonly carregando = input(false);
  readonly total = input(0);
  readonly pagina = input(1);
  readonly tamanhoPagina = input(10);

  readonly queryParams = output<NzTableQueryParams>();
  readonly acao = output<{ chave: string; linha: T }>();

  executarAcao(chave: string, linha: T): void {
    this.acao.emit({ chave, linha });
  }
}
