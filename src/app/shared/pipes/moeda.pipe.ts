import { Pipe, PipeTransform } from '@angular/core';

/** Converte centavos (integer) para moeda BRL: 123456 -> "R$ 1.234,56". */
@Pipe({ name: 'moeda', standalone: true })
export class MoedaPipe implements PipeTransform {
  transform(valorCentavos: number | null | undefined, moeda = 'BRL'): string {
    if (valorCentavos === null || valorCentavos === undefined) return '—';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
    }).format(valorCentavos / 100);
  }
}
