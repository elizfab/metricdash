import { Component, input } from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-empty-state',
  imports: [NzEmptyModule],
  template: `
    <div class="empty-state">
      <nz-empty [nzNotFoundContent]="mensagem()" />
    </div>
  `,
  styles: `
    .empty-state { padding: 48px 0; display: flex; justify-content: center; }
  `,
})
export class EmptyState {
  readonly mensagem = input('Nenhum registro encontrado.');
}
