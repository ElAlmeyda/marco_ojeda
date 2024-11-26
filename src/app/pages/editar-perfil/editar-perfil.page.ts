import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, ToastController } from '@ionic/angular';
import { EmailAuthProvider } from 'firebase/auth';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  uid ='';

  nombreInvalido: boolean = false;
  correoInvalido: boolean = false;
  passwordInvalido: boolean = false;
  movilInvalido: boolean = false;

  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  };

  actualizarUser: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  }
  showPassword: boolean = false;

  

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, public toast: ToastController, public afAuth: AngularFireAuth, public alertController: AlertController) { 
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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.actualizarUser = usuario;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  async editar() {
    const user = await this.afAuth.currentUser;
    
    if (user) {
      if (user.emailVerified) {
        try {
          // Verificar si el correo ha cambiado
          if (user.email !== this.actualizarUser.correo) {
            let correo = this.actualizarUser.correo;
            await this.reautenticarUsuario(user);
            await user.updateEmail(this.actualizarUser.correo);
            const check = await this.user.actualizarInfo(this.actualizarUser.nombre, correo, this.actualizarUser.movil, this.actualizarUser.password, this.uid);
                if (check) {
                this.presentToast("Actualizado con éxito");
              } else {
                this.presentToast("Actualizado fallido");
              }
          }
          
          // Enviar correo de verificación si se cambió el correo
          if (user.email !== this.actualizarUser.correo) {
            await user.sendEmailVerification();
          }
          
        } catch (error) {
          console.error("Error al actualizar el correo:", error);
          this.presentToast("Error al actualizar el correo");
        }
      } else {
        this.presentToast("Para poder cambiar el correo, este debe estar verificado");
        await user.sendEmailVerification(); 
      }
    }
  }
  
  async reautenticarUsuario(user: any) {
    try {
      const alert = await this.alertController.create({
        header: 'Reautenticación',
        inputs: [
          {
            name: 'email',
            type: 'email',
            placeholder: 'Correo electrónico',
            value: user.email
          },
          {
            name: 'password',
            type: 'password',
            placeholder: 'Contraseña',
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: async (data) => {
              try {
                // Reautenticación con las credenciales proporcionadas
                const credential = EmailAuthProvider.credential(data.email, data.password);
                await user.reauthenticateWithCredential(credential);
                console.log(this.actualizarUser.correo);
                
                console.log('Reautenticación exitosa');
              } catch (error) {
                console.error('Error al reautenticar al usuario:', error);
                this.presentToast("No se pudo reautenticar. Intenta nuevamente.");
              }
            }
          }
        ]
      });
  
      await alert.present();
    } catch (error) {
      console.error("Error al solicitar reautenticación:", error);
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });

    await toast.present();
  }

  validacionFormulario() {
    this.nombreInvalido = this.actualizarUser.nombre.length < 4;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.correoInvalido = !emailRegex.test(this.actualizarUser.correo);
    const passwordRegex = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}/;
    this.passwordInvalido = !passwordRegex.test(this.actualizarUser.password);
    this.movilInvalido = this.actualizarUser.movil.length !== 9;
  }

  mostrarErrorContrasena(){
    if (this.passwordInvalido) {
      this.presentToast("La contraseña debe tener al menos un número, una letra, un carácter especial y ser de al menos 6 caracteres de longitud.");
    }
  }
}
