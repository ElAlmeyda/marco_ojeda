import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private path = 'usuario/';

  usuarioLogin:boolean=false;

  user = {
    nombre: "Dario Almeida Garcia",
    password: "0708",
    correo: "almeidadario@hotamil.com",
    movil: "665970213"
  }

  constructor( private database: FirestoreService) {
  }

  nuevoUser(nombre:string, correo:string, password:string, movil:string){
    if(this.user.correo != correo){
      const id = this.database.getId();
      const data = {nombre, correo, password, movil, id};
      this.database.creatDoc(data, this.path, id);
      return true;
    }
    return false;
  }

  leerUser(user:string, password:string){
    console.log(user, password);
    if(user == this.user.correo && password == this.user.correo){
      this.getLogin();
    }
  }

  actualizarUser(){

  }

  changeUserLogin(change:boolean){
    return this.usuarioLogin=change
  }
  
  getLogin() {
    return this.usuarioLogin=true;
  }
}
