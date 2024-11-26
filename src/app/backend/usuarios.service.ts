import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Usuario } from '../model';
import { Observable, filter, map, pipe, tap } from 'rxjs';
import { FirestoreAuthService } from '../service/firestore-auth.service';
import { NotificacionService } from '../service/notificacion.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private path = 'Usuarios/';

  usuarioLogin:boolean=false;

  usuario: Usuario [] = [];

  uid= '';

  constructor(public firestoreService: FirestoreService,  public firestroreAuth: FirestoreAuthService, public notificacion: NotificacionService) {
  }

  changeUserLogin(change:boolean){
    return this.usuarioLogin = change;
  }

  getUsuario(){
    return this.usuario;
  }

  getUsuarios(){
    return this.firestoreService.getCollection<Usuario>(this.path).pipe(
      tap((res: Usuario[]) => {
        this.usuario = res;
      })
    );
  }

  async createUser(nombre:string, correo:string, password:string, movil:string, rol:string){
    const data = {nombre, correo, movil, uid:'', rol};
      try{
        await this.firestroreAuth.registrarse(correo, password);
        const uid: string | null = await this.firestroreAuth.getUid();
        if(uid){
          const uidString = uid;
          console.log(uidString);
          data['uid'] = uid;
          this.firestoreService.creatDoc(data, this.path, uidString);
          this.notificacion.inicializar(uidString);
        } else {
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error al crear usuario:", error);
        return false;
      }
    }

  inicioSesion(correo: string, password: string){
    this.changeUserLogin(true);
    return this.firestroreAuth.login(correo, password);
  }

  async logout(){
    this.changeUserLogin(false);
    await this.notificacion.eliminarToken();
    return this.firestroreAuth.logout();
  }

  getInfoUser(uid:string){
    return this.firestoreService.getDoc<Usuario>(this.path, uid).pipe(
      map((res: Usuario | undefined) => res ? [res] : [])
    );
  }

  verificarCorreoExiste(correo: string){
    const usuarioExistente = this.usuario.find(usuario => usuario.correo === correo);
    if(usuarioExistente){
      return false;
    } else {
      return true;
    }
  }

  getUsuarioConcreto(id: string){
    return this.usuario.find(usuario => usuario.uid === id);
  }

  async actualizarInfo(nombre: string, correo: string, movil: string, password:string, uid:string){
    const data = {nombre, correo, movil, password, uid};
    try {
      await this.firestoreService.updateDoc(data, this.path, uid);
      await this.firestroreAuth.updatePassword(password);
      return true; 
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      return false; 
    }
  }
  
}
