import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioLogin:boolean=false;

  user = {
    nombre: "Dario Almeida Garcia",
    password: "0708",
    correo: "almeidadario@hotamil.com"
  }

  constructor() {
  }

  nuevoUser(){

  }

  leerUser(){

  }

  changeUserLogin(change:boolean){
    return this.usuarioLogin=change
  }
  
  getLogin() {
    return this.usuarioLogin=true;
  }
}
