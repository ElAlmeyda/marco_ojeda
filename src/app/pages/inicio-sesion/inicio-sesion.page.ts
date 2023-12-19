import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  
  credenciales = {
    correo: '',
    password: ''
  }

  constructor(private user: UsuariosService) { 

  }

  ngOnInit() {
  }

  login() {
    alert("Usuario inicio sesion correctamente");
    this.user.leerUser(this.credenciales.correo, this.credenciales.password);
  }


}
