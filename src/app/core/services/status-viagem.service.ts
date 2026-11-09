import { Injectable } from '@angular/core';
import { StatusViagem } from '../models/status-viagem.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class StatusViagemService extends CrudService<StatusViagem> {
  protected override tabela = 'status_viagem';
}
