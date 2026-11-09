import { Injectable } from '@angular/core';
import { Hospedagem } from '../models/hospedagem.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class HospedagemService extends CrudService<Hospedagem> {
  protected override tabela = 'hospedagens';
  protected override selectPadrao = '*, hoteis(id, nome, cidade, estado)';
}
