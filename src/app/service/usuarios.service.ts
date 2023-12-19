import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioLogin:boolean=false;

  user = {
    nombre: "Dario Almeida Garcia",
    password: "0708",
    correo: "almeidadario@hotamil.com",
    movil: "665970213"
  }

  constructor() {
  }

  nuevoUser(nombre:string, correo:string, password:string, movil:string){
    if(this.user.correo != correo){
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
