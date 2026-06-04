import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';
import { NotificacionService } from 'src/app/service/notificacion.service';
import { Capacitor } from '@capacitor/core';


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


  nombreInvalido: boolean = false;
  correoInvalido: boolean = false;
  passwordInvalido: boolean = false;
  movilInvalido: boolean = false;
  
  crearUser = {
    nombre: '',
    movil: '',
    correo: '',
    password: ''
  }
  rol="cliente";

  terminosAceptados: boolean = false;

  correcto = false;
  guardarEjecutado = false;

  isFlipped: boolean = false;

  flipCard() {
    this.isFlipped = !this.isFlipped;
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
        if(Capacitor.isNativePlatform()){
          this.notificacion.inicializar();
        }
      })
      .catch(() => {
        // Error durante el inicio de sesión
        this.presentToast("Contraseña o email son incorrectos", 'danger');
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


  async guardar(){
    const existeCorreo = this.user.verificarCorreoExiste(this.crearUser.correo); 
    if (!existeCorreo) {
      this.presentToast("Registrado fallido, el correo ya está asociado a otra cuenta", 'danger');
    } else {
      const check = await this.user.createUser(this.crearUser.nombre, this.crearUser.correo, this.crearUser.password, this.crearUser.movil, this.rol);
      if (check) {
        this.router.navigate(['/folder']);
        this.presentToast("Registrado con éxito", 'success');
        
      } else {          
      this.presentToast("Registrado fallido, ocurrió un error al crear el usuario", 'danger');
      }
    }
  }

  validacionFormulario() {
    this.nombreInvalido = this.crearUser.nombre.length < 4;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.correoInvalido = !emailRegex.test(this.crearUser.correo);
    const passwordRegex = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}/;
    this.passwordInvalido = !passwordRegex.test(this.crearUser.password);
    this.movilInvalido = this.crearUser.movil.length !== 9;
  }

  mostrarErrorContrasena(){
    if (this.passwordInvalido) {
      this.presentToast("La contraseña debe tener al menos un número, una letra, un carácter especial y ser de al menos 6 caracteres de longitud.", 'danger');
    }
  }
}
