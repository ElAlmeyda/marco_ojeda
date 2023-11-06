import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  
  credenciales = {
    correo: null,
    password: null
  }

  constructor() { 

  }

  ngOnInit() {
  }

  login() {
    console.log(this.credenciales.correo, this.credenciales.password);
  }


}
