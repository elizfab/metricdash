import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class HotelService extends CrudService<Hotel> {
  protected override tabela = 'hoteis';
}
