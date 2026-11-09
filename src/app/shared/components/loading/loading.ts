import { Component, input } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-loading',
  imports: [NzSpinModule],
  template: `
    <div class="loading">
      <nz-spin [nzSize]="tamanho()" nzSimple />
      @if (mensagem(); as msg) {
        <p class="loading__msg">{{ msg }}</p>
      }
    </div>
  `,
  styles: `
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 48px 0;
    }
    .loading__msg { color: var(--md-text-secondary, #b8b8cc); }
  `,
})
export class Loading {
  readonly mensagem = input<string>();
  readonly tamanho = input<'small' | 'default' | 'large'>('large');
}
