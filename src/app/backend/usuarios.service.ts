import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Usuario } from '../model';
import { Observable, filter, map, pipe, tap } from 'rxjs';
import { FirestoreAuthService } from '../service/firestore-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private path = 'Usuarios/';

  usuarioLogin:boolean=false;

  usuario: Usuario [] = [];

  uid= '';

  constructor(public firestoreService: FirestoreService,  public firestroreAuth: FirestoreAuthService) {
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

  async createUser(nombre:string, correo:string, password:string, movil:string){
    const data = {nombre, correo, password, movil, uid:''};
      try{
        await this.firestroreAuth.registrarse(correo, password);
        const uid: string | null = await this.firestroreAuth.getUid();
        if(uid){
          const uidString = uid;
          console.log(uidString);
          data['uid'] = uid;
          this.firestoreService.creatDoc(data, this.path, uidString);
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

  logout(){
    this.changeUserLogin(false);
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

  async actualizarInfo(nombre: string, correo: string, movil: string, uid:string){
    const data = {nombre, correo, movil, uid};
    try {
      // Llama a la función updateDoc() para actualizar los datos en Firestore
      await this.firestoreService.updateDoc(data, this.path, uid);
      return true; // Devuelve true si la actualización se realizó con éxito
  } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      return false; // Devuelve false si la actualización falla
  }
  }
  
}
