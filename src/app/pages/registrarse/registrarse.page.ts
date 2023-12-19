import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {


  crearUser = {
    nombre: '',
    movil: '',
    correo: '',
    password: ''
  }

  correcto = false;


  constructor(private user: UsuariosService) { }

  ngOnInit() {
  }
 


  guardar(){
    console.log("Funciona el boton");
    this.correcto = this.user.nuevoUser(this.crearUser.nombre, this.crearUser.correo, this.crearUser.password, this.crearUser.movil);
    if(this.correcto){
      alert(this.crearUser.nombre + " se ha registrado correctamente");
    } else {
      alert(this.crearUser.nombre + " ya existe uno con ese correo");
    }
  }
}
