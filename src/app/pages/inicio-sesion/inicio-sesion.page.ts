import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  usuario: Usuario[]= [];
  credenciales = {
    correo: '',
    password: ''
  }

  constructor(private user: UsuariosService, public router: Router, public toast: ToastController) { 

  }

  ngOnInit() {
  }

  login() {

    this.user.inicioSesion(this.credenciales.correo, this.credenciales.password)
      .then(() => {
        // Inicio de sesión exitoso
        this.router.navigate(['/folder']);
        this.presentToast("Inicio de sesion con éxito");
      })
      .catch((error: any) => {
        // Error durante el inicio de sesión
        console.error('Error al iniciar sesión:', error);
        this.presentToast("Inicio de sesion sin exito");
      });
  }

  async presentToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });

    await toast.present();
  }

}
