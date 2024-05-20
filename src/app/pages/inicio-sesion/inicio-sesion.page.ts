import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';
import { NotificacionService } from 'src/app/service/notificacion.service';

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

  constructor(private user: UsuariosService, public router: Router, public toast: ToastController, public notificacion: NotificacionService) { 

  }

  ngOnInit() {
  }

  login() {

    this.user.inicioSesion(this.credenciales.correo, this.credenciales.password)
      .then(() => {
        // Inicio de sesión exitoso
        this.router.navigate(['/folder']);
        this.presentToast("Inicio de sesion con éxito", 'success');
        this.solicitarPermisos();
      })
      .catch(() => {
        // Error durante el inicio de sesión
        this.presentToast("Contraseña o email son incorrectos", 'danger');
      });
  }

  solicitarPermisos() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Permiso concedido, registrar el token de registro
        this.registrarToken();
      } else {
        // Permiso denegado, mostrar un mensaje al usuario
        console.log('Los permisos para recibir notificaciones han sido denegados.');
      }
    });
  }

  registrarToken() {
    PushNotifications.addListener('registration', (token: any) => {
      console.log('Token de registro:', token.value);
      // Envía el token de registro al servidor para su almacenamiento
      this.notificacion.guardarToken(token.value);
    });
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: color
    });

    await toast.present();
  }
}
