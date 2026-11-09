import { Injectable } from '@angular/core';
import { CategoriaDespesa } from '../models/categoria-despesa.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class CategoriaService extends CrudService<CategoriaDespesa> {
  protected override tabela = 'categorias_despesa';
}
