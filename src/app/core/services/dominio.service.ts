import { Injectable } from '@angular/core';
import { Dominio } from '../models/dominio.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class DominioService extends CrudService<Dominio> {
  protected override tabela = 'dominios';
}
