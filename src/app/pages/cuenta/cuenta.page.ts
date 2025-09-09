import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { EmailAuthProvider } from 'firebase/auth';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
    avatar: '',
  };

  uid='';
  enviado =false;
  nuevoCorreo='';

  constructor(public firestore: FirestoreService, public user: UsuariosService, private navCtrl: NavController, public auth: FirestoreAuthService, public alertController: AlertController,
              private afAuth: AngularFireAuth, public router: Router, public toast: ToastController, private loadingCtrl: LoadingController, public authFire: AngularFireAuth) {  
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
        this.obtenerUsuario();
      } 
    });
  }

  async obtenerUsuario() {
    await this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.usuario.uid);
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }

  ngOnInit() {
  }
  
  volver(){
    this.navCtrl.back();
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
                    await this.auth.resetPassword(this.usuario.correo);
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


   async showActionSheet(campo: string) {
    const user = await this.afAuth.currentUser;
    
    if (user) {
      if (user.emailVerified) {
        try {
          // Verificar si el correo ha cambiado
          if (user.email !== this.usuario.correo) {
            let correo = this.usuario.correo;
            await this.reautenticarUsuario(user);
            await user.updateEmail(this.usuario.correo);
            const check = await this.user.updateCorreo(this.nuevoCorreo, this.usuario.uid);
                if (check) {
                this.presentToast("Actualizado con éxito", 'success');
              } else {
                this.presentToast("Actualizado fallido", 'danger');
              }
          }
          
          // Enviar correo de verificación si se cambió el correo
          if (user.email !== this.usuario.correo) {
            await user.sendEmailVerification();
          }
          
        } catch (error) {
          console.error("Error al actualizar el correo:", error);
          this.presentToast("Error al actualizar el correo", 'danger');
        }
      } else {
        this.presentToast("Para poder cambiar el correo, este debe estar verificado", 'danger');
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
                
              } catch (error) {
                this.presentToast("No se pudo reautenticar. Intenta nuevamente.", 'danger');
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

  async eliminar() {
    const actionSheet = await this.alertController.create({
      header: 'Eliminar cuenta',
      message: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => {
            try {
              const user = await this.afAuth.currentUser;
              if (user) {
                // Volver a pedir credenciales al usuario
                const alert = await this.alertController.create({
                  header: 'Reautenticación',
                  inputs: [
                    {
                      name: 'email',
                      type: 'email',
                      placeholder: 'Correo electrónico',
                    },
                    {
                      name: 'password',
                      type: 'password',
                      placeholder: 'Contraseña',
                    },
                  ],
                  buttons: [
                    {
                      text: 'Cancelar',
                      role: 'cancel',
                    },
                    {
                      text: 'Confirmar',
                      handler: async (data) => {
                        const credential = EmailAuthProvider.credential(data.email, data.password);
                        
                        const loading = await this.loadingCtrl.create({
                          message: 'Eliminando tu cuenta, por favor espera...',
                          spinner: 'circles',
                          backdropDismiss: false
                        });

                        await loading.present();
                        try {
                          // Reautenticar
                          await user.reauthenticateWithCredential(credential);
                          // Copiar datos a 'Eliminado/{uid}'
                          await this.user.marcarUsuarioComoEliminado(this.usuario, user.uid);
                          // Eliminar cuenta
                          await user.delete();
                          this.logout();
                        } catch (reauthError) {
                          console.error('Error al reautenticar o eliminar:', reauthError);
                          
                          await loading.dismiss(); // ⚠️ También ocultar en caso de error

                          const errorAlert = await this.alertController.create({
                            header: 'Error',
                            message: 'Hubo un error. Verifica tus credenciales o intenta más tarde.',
                            buttons: ['OK'],
                          });
                          await errorAlert.present();
                        }
                        await loading.dismiss(); // ✅ Ocultar loading al completar

                      },
                    },
                  ],
                });
  
                await alert.present();
              }
            } catch (error) {
              console.error('Error al eliminar la cuenta:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Hubo un error al intentar eliminar tu cuenta. Intenta nuevamente.',
                buttons: ['OK'],
              });
  
              await errorAlert.present();
            }
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
  
    await actionSheet.present();
  }

  async reenviarCorreo(){
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.sendEmailVerification();
      this.presentToast('Se ha reenviado el correo de verificación. Revisa tu bandeja de entrada.', 'success');
      }
    } catch (error) {
      console.error('Error al reenviar el correo de verificación:', error);
      this.presentToast('Hubo un error al intentar reenviar el correo. Por favor, inténtalo de nuevo.', 'danger');
    }
  }

  async verificarEstado(){
    try {
      const user = await this.afAuth.currentUser;
      if (user && user.emailVerified) {
        this.presentToast('¡Correo verificado con éxito!', 'success');
        this.enviado = false;
      } else {
        this.presentToast('Tu correo aún no está verificado. Por favor, verifica antes de continuar.', 'danger');
        this.enviado = true;
      }
    } catch (error) {
      console.error('Error al verificar el estado del correo:', error);
    }
  }

  async logout() {
  try {
    await this.authFire.signOut();   // Cierra sesión en Firebase
    
    // Limpia el objeto usuario para que no muestre nada
    this.usuario = { uid: '', nombre: '', movil: '', avatar: '', correo: '' };
    
    // Opcional: redirige a login o inicio
    this.router.navigate(['/tabs/folder', this.usuario.uid], { replaceUrl: true });
  } catch (err) {
    console.error("❌ Error al cerrar sesión:", err);
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
