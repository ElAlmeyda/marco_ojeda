import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CitaService } from 'src/app/backend/cita.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Cita, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import 'hammerjs';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  uid ='';
  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
  };

  correo: string='';
  password: string='';
  showPassword: any;
  correoExistente=false;
  registro=false;
  correoInvalido=false;
  nombre: string='';
  nombreInvcalido=false;
  phone: string='';
  numeroIncorrecto=false;
  usuariosBloqueados: Usuario[] = [];

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, public citas: CitaService, private alertController: AlertController,
              public firestore: FirestoreService, private loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public toast: ToastController,
  ) { 
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        this.obtenerUsuario();
      } else {
        this.uid= '';
      }
    });
  }

  

  ngOnInit() {
     
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.usuario = usuario;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  inicioSesion() {
    
  }

  formatCorreo(){
    const correo = this.correo.trim().toLowerCase();
     this.user.verificarCorreoExistente(correo).subscribe(existe => {
      console.log(existe);
      if(!existe){
        this.registro = true;
        console.log(this.registro, "Rgistro");
      } else {
        this.correoExistente = existe;
      }
    });
  }

  comprobarCorreo(){
    const correo = this.correo.trim().toLowerCase();
    const correoValido = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.(com|es)$/i.test(correo);

    if (!correoValido) {
      this.correoInvalido = true;  // Nuevo flag para mostrar mensaje de error
      return;
    }
    this.correoInvalido = false;  // Es válido, continúa con la verificación en la base de datos
  }

  comprobarNombre(){
    if(this.nombre.length < 3){
      this.nombreInvcalido = true;
    } else {
      this.nombreInvcalido = false;
    }
  }

  comprobarNumero() {
    const phoneRegex = /^[0-9]{9}$/;
    this.numeroIncorrecto = !phoneRegex.test(this.phone);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isValidPassword(): boolean {
    const passwordPattern = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}/;
    return passwordPattern.test(this.password);
  }

  async crearUsuario(){
    const loading = await this.loadingCtrl.create({
      message: 'Se está terminando de crear tu perfil, por favor espera...',
      spinner: 'circles',
      backdropDismiss: false
    });

    await loading.present();

    try {
      // 1. Crear usuario
      const usuario = await this.user.createUser(this.nombre, this.correo, this.password, this.phone);
      if (!usuario) throw new Error('Error creando el usuario');

      const user = await this.afAuth.currentUser;

      try {
        if(user)
        await user.sendEmailVerification();
      } catch (error) {
        console.error('Error enviando correo de verificación:', error);
      }
      // ✅ 8. Ocultar carga después de subir todo correctamente
      await loading.dismiss();
    } catch (error) {
      console.error('Error en el registro:', error);
      // ⚠️ Ocultar carga en caso de error también
      await loading.dismiss();
      // Puedes mostrar aquí un toast o alerta si quieres notificar el fallo
    }
  }

   async cambioContrasena(){
    const user = await this.afAuth.currentUser;
    if (user) {
      if (!user.emailVerified) {
          const alert = await this.alertController.create({
            header: '¿Quieres cambiar la contraseña?',
            message: 'Te llegara un correo para cambiar la contraseña, y luego tendras que volver a Iniciar Sesion',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: async () => {

                }
              },
              {
                text: 'Aceptar',
                handler: async () => {
                    await this.auth.resetPassword(this.correo);
                    this.presentToast('Se te ha enviado el correo para cambiar la contraseña.', 'success');
                  }
                }
            ],
          });
  
          await alert.present();
      }
    } else {
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo obtener el usuario actual. Por favor, asegúrate de estar autenticado.',
        buttons: ['OK'],
      });
      await errorAlert.present();
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

}
