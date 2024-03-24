import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Usuario } from '../model';
import { pipe, tap } from 'rxjs';
import { FirestoreAuthService } from '../service/firestore-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private path = 'Usuarios/';

  usuarioLogin:boolean=false;

  usuario: Usuario []= [];

  constructor(public firestoreService: FirestoreService,  public firestroreAuth: FirestoreAuthService) {
  }

  actualizarUser(){

  }

  changeUserLogin(change:boolean){
    return this.usuarioLogin=change
  }
  
  getLogin() {
    return this.usuarioLogin=true;
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
    const data = {nombre, correo, password, movil, id:''};
    const usuarioExistente = this.usuario.find(usuario => usuario.correo === correo);
    if(usuarioExistente){
      return false;
    } else {
      try{
        await this.firestroreAuth.registrarse(correo, password);
        const uid: string | null = await this.firestroreAuth.getUid();
        if(uid){
          const uidString = uid;
          console.log(uidString);
          data['id'] = uid;
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
  }

  
}
