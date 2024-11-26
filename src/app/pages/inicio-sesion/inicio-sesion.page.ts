
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
  showPassword: boolean = false;


  constructor(private user: UsuariosService, public router: Router, public toast: ToastController, public notificacion: NotificacionService) { 

  }

  ngOnInit() {
  }

  login() {

    this.user.inicioSesion(this.credenciales.correo, this.credenciales.password)
      .then((userCredenciales) => {
        // Inicio de sesión exitoso

        this.router.navigate(['/folder']);
        this.presentToast("Inicio de sesion con éxito", 'success');
        const uid = userCredenciales.user?.uid;
        if(uid){
          this.notificacion.inicializar(uid);
        }
      })
      .catch(() => {
        // Error durante el inicio de sesión
        this.presentToast("Contraseña o email son incorrectos", 'danger');
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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
