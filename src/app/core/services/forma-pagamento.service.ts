import { Injectable } from '@angular/core';
import { FormaPagamento } from '../models/forma-pagamento.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class FormaPagamentoService extends CrudService<FormaPagamento> {
  protected override tabela = 'formas_pagamento';
}
