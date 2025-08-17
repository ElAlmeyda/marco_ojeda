import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Cita, Tatuador } from '../model';
import { lastValueFrom, tap } from 'rxjs';
import { FirestoreAuthService } from '../service/firestore-auth.service';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  path="/Tatuador"
  
  uid='';
  tienda: Tatuador [] = [];

  constructor(public firestrore: FirestoreService, public firestroreAuth: FirestoreAuthService,) { 
    this.firestroreAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
      } else {
        this.uid= '';
      }
    });
  }

  getTatuadores() {
    return this.firestrore.getTatuadores();
  }

  getTatuadorById(uid: string) {
    return this.firestrore.getTatuadorById(uid);
  }

  getAvataresDeTatuador(uid: string) {
    return this.firestrore.getAvatarUrl(uid);
  }


  getFavoritoPath(userId: string, tatuadorId: string): string {
    return `Usuarios/${userId}/favoritos/${tatuadorId}`;
  }

  async esFavorito(userId: string, tatuadorId: string): Promise<boolean> {
    const doc = await lastValueFrom(this.firestrore.getDocument(this.getFavoritoPath(userId, tatuadorId)));
    return doc?.exists ?? false;
  }

  agregarFavorito(userId: string, tatuador: any) {
    return this.firestrore.setDocument(
      this.getFavoritoPath(userId, tatuador.uid),
      {
        uid: tatuador.uid,
        nombreTienda: tatuador.nombreTienda,
        fav: true
      }
    );
  }

  quitarFavorito(userId: string, tatuadorId: string) {
    return this.firestrore.deleteDocument(this.getFavoritoPath(userId, tatuadorId));
  }

  obtenerFavorito(userId: string){
    return this.firestrore.obtenerFavorito(userId)
  }

  verificarFavorito(userId: string, tatuId: string){
    return this.firestrore.verificarFavorito(userId, tatuId)
  }

  guardarCita(cita:any, uidCliente:string, uidTatuador:string){
    return this.firestrore.guardarCita(cita, uidCliente, uidTatuador);
  }

  getCitasUsuario(uid: string) {
    return this.firestrore.getCitasUsuario(uid);
  }

  guardarResena(resena:any, uidCliente:string, uidTatuador:string){
    return this.firestrore.guardarResena(resena, uidCliente, uidTatuador);
  }

  getResenaTatuador(uid: string) {
    return this.firestrore.getResenaTatuador(uid);
  }

  getResenaUsuario(uid: string) {
    return this.firestrore.getResenaUsuario(uid);
  }

  existeResena(uidUsuario: string, uidTatuador: string){
    return this.firestrore.existeResena(uidUsuario,uidTatuador);
  }

  eliminarResena(uid: string, uidTatuador: string, uidResena: string) {
    return this.firestrore.eliminarResena(uid, uidTatuador, uidResena);
  }

  actualizarResena(uidCliente: string, uidTatuador: string, uidResena: string, resena: any) {
    return this.firestrore.actualizarResena(uidCliente, uidTatuador, uidResena, resena);
  }

}
