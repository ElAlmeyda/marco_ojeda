import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import {  Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import { NotificacionService } from 'src/app/service/notificacion.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

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


  correcto = false;
  guardarEjecutado = false;


  constructor(private user: UsuariosService, public router: Router, public toast: ToastController, public notificacion: NotificacionService) { }

  ngOnInit() {
    
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
 


  async guardar(){
    const existeCorreo = this.user.verificarCorreoExiste(this.crearUser.correo); 
    if (!existeCorreo) {
      this.presentToast("Registrado fallido, el correo ya está asociado a otra cuenta", 'danger');
    } else {
      const check = await this.user.createUser(this.crearUser.nombre, this.crearUser.correo, this.crearUser.password, this.crearUser.movil, this.rol);
      if (check) {
        this.router.navigate(['/folder']);
        this.presentToast("Registrado con éxito", 'success');
        this.solicitarPermisos();
      } else {          
      this.presentToast("Registrado fallido, ocurrió un error al crear el usuario", 'danger');
      }
    }
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
