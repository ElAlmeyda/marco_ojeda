import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Cita, Tienda } from '../model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  constructor(public firestrore: FirestoreService) { }
  path=""

  getTatuador(){
    return []
  }
}
