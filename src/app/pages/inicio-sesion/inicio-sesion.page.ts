import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { FirestoreService } from 'src/app/service/firestore.service';

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
