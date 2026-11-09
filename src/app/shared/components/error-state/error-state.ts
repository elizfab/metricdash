import { Component, input, output } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-error-state',
  imports: [NzAlertModule, NzButtonModule],
  template: `
    <div class="error-state">
      <nz-alert
        nzType="error"
        [nzMessage]="mensagem()"
        nzShowIcon
        [nzDescription]="mostrarTentarNovamente() ? '' : null"
      />
      @if (mostrarTentarNovamente()) {
        <button nz-button nzType="primary" (click)="tentarNovamente.emit()">
          Tentar novamente
        </button>
      }
    </div>
  `,
  styles: `
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px 0;
    }
  `,
})
export class ErrorState {
  readonly mensagem = input('Ocorreu um erro ao carregar os dados.');
  readonly mostrarTentarNovamente = input(true);
  readonly tentarNovamente = output<void>();
}
