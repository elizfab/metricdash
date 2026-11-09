import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MoedaPipe } from '../../pipes/moeda.pipe';

export type FormatoStatCard = 'moeda' | 'numero' | 'texto';

@Component({
  selector: 'app-stat-card',
  imports: [NzCardModule, NzIconModule, MoedaPipe, DecimalPipe],
  template: `
    <nz-card class="stat-card" nzHoverable>
      <div class="stat-card__inner">
        <div class="stat-card__info">
          <span class="stat-card__titulo">{{ titulo() }}</span>
          <span class="stat-card__valor">
            @if (formato() === 'moeda') {
              {{ valor() | moeda }}
            } @else {
              {{ valor() | number: '1.0-2' }}
            }
          </span>
          @if (descricao(); as desc) {
            <span class="stat-card__descricao">{{ desc }}</span>
          }
        </div>
        @if (icone(); as icon) {
          <span class="stat-card__icone" nz-icon [nzType]="icon"></span>
        }
      </div>
    </nz-card>
  `,
  styles: `
    .stat-card { height: 100%; }
    .stat-card__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .stat-card__info { display: flex; flex-direction: column; gap: 4px; }
    .stat-card__titulo {
      font-size: 13px;
      color: var(--md-text-secondary, #b8b8cc);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-card__valor {
      font-size: 28px;
      font-weight: 700;
      color: var(--md-text, #fdf7fe);
    }
    .stat-card__descricao { font-size: 12px; color: var(--md-text-secondary, #b8b8cc); }
    .stat-card__icone {
      font-size: 32px;
      color: #17b4da;
    }
  `,
})
export class StatCard {
  readonly titulo = input.required<string>();
  readonly valor = input.required<number>();
  readonly descricao = input<string>();
  readonly icone = input<string>();
  readonly formato = input<FormatoStatCard>('moeda');
}
