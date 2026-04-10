import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EmailAuthProvider } from 'firebase/auth';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  usuario: Usuario = {
    uid: '',
    nombre: '',
    email: '',
    avatar: '',
  };

  uid='';
  enviado =false;
  nuevoCorreo='';

  constructor(public firestore: FirestoreService, public user: UsuariosService, private navCtrl: NavController, public auth: FirestoreAuthService, public alertController: AlertController,
              private afAuth: AngularFireAuth, public router: Router, public translate: TranslateService, public toast: ToastController, private loadingCtrl: LoadingController, public authFire: AngularFireAuth) {  
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
    const header = await this.translate.get('PASSWORD_CHANGE_TITLE').toPromise();
    const message = await this.translate.get('PASSWORD_CHANGE_MESSAGE').toPromise();
    const cancelText = await this.translate.get('CANCEL').toPromise();
    const acceptText = await this.translate.get('ACCEPT').toPromise()
  
    if (user) {
      if (!user.emailVerified) {
          const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
              {
                text: cancelText,
                role: 'cancel',
                handler: async () => {

                }
              },
              {
                text: acceptText,
                handler: async () => {
                    await this.auth.resetPassword(this.usuario.email);
                    const successMsg = await this.translate.get('PASSWORD_CHANGE_SUCCESS').toPromise();
                    this.presentToast(successMsg, 'success');
                  }
                }
            ],
          });
  
          await alert.present();
      }
    } else {
      const header = await this.translate.get('ERROR').toPromise();
      const message = await this.translate.get('USER_FETCH_ERROR').toPromise();
      const errorAlert = await this.alertController.create({
        header: header,
        message: message,
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
          if (user.email !== this.usuario.email) {
            let correo = this.usuario.email;
            await this.reautenticarUsuario(user);
            await user.updateEmail(this.usuario.email);
            const check = await this.user.updateCorreo(this.nuevoCorreo, this.usuario.uid);
            if (check) {
              const successMsg = await this.translate.get('EMAIL_UPDATE_SUCCESS').toPromise();
              this.presentToast(successMsg, 'success');
            } else {
              const failMsg = await this.translate.get('EMAIL_UPDATE_FAIL').toPromise();
              this.presentToast(failMsg, 'danger');
            }
          }
          
          // Enviar correo de verificación si se cambió el correo
          if (user.email !== this.usuario.email) {
            await user.sendEmailVerification();
          }
          
        } catch (error) {
          console.error("Error al actualizar el correo:", error);
          const errorMsg = await this.translate.get('EMAIL_UPDATE_ERROR').toPromise();
          this.presentToast(errorMsg, 'danger');
          FirebaseCrashlytics.log({
            message: 'Error al actualizar el correo'
          });

          FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
          FirebaseCrashlytics.setCustomKey({
            key: 'pantalla cliente',
            value: 'perfil_usuario',
            type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
          });
        }
      } else {
        const warningMsg = await this.translate.get('EMAIL_NOT_VERIFIED').toPromise();
        this.presentToast(warningMsg, 'danger');
        await user.sendEmailVerification(); 
      }
    }
  }
  
  async reautenticarUsuario(user: any) {
     const [header, emailPlaceholder, passwordPlaceholder, cancel, confirm, errorMsg] = await Promise.all([
        this.translate.get('REAUTH_TITLE').toPromise(),
        this.translate.get('EMAIL').toPromise(),
        this.translate.get('PASSWORD').toPromise(),
        this.translate.get('CANCEL').toPromise(),
        this.translate.get('CONFIRM').toPromise(),
        this.translate.get('REAUTH_FAIL').toPromise()
      ]);
    try {
      const alert = await this.alertController.create({
        header: header,
        inputs: [
          {
            name: 'email',
            type: 'email',
            placeholder: emailPlaceholder,
            value: user.email
          },
          {
            name: 'password',
            type: 'password',
            placeholder: passwordPlaceholder,
          }
        ],
        buttons: [
          {
            text: cancel,
            role: 'cancel',
          },
          {
            text: confirm,
            handler: async (data) => {
              try {
                // Reautenticación con las credenciales proporcionadas
                const credential = EmailAuthProvider.credential(data.email, data.password);
                await user.reauthenticateWithCredential(credential);
                
              } catch (error) {
                this.presentToast(errorMsg, 'danger');
              }
            }
          }
        ]
      });
      await alert.present();
    } catch (error) {
      console.error("Error al solicitar reautenticación:", error);
      FirebaseCrashlytics.log({
        message: 'Error al solicitar reautenticacion'
      });

      FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
      FirebaseCrashlytics.setCustomKey({
        key: 'pantalla cliente',
        value: 'perfil_usuario',
        type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
      });
    }  
  }

  async eliminar() {
    const [
      header,
      message,
      accept,
      cancel,
      reauthTitle,
      emailPlaceholder,
      passwordPlaceholder,
      loadingMessage,
      errorHeader,
      deleteErrorMsg,
      deleteFailMsg
    ] = await Promise.all([
      this.translate.get('DELETE_ACCOUNT_TITLE').toPromise(),
      this.translate.get('DELETE_ACCOUNT_MESSAGE').toPromise(),
      this.translate.get('ACCEPT').toPromise(),
      this.translate.get('CANCEL').toPromise(),
      this.translate.get('REAUTH_TITLE').toPromise(),
      this.translate.get('EMAIL').toPromise(),
      this.translate.get('PASSWORD').toPromise(),
      this.translate.get('DELETING_ACCOUNT_LOADING').toPromise(),
      this.translate.get('ERROR').toPromise(),
      this.translate.get('DELETE_ERROR_MESSAGE').toPromise(),
      this.translate.get('DELETE_FAIL_MESSAGE').toPromise()
    ]);
    const actionSheet = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: accept,
          handler: async () => {
            try {
              const user = await this.afAuth.currentUser;
              if (user) {
                // Volver a pedir credenciales al usuario
                const alert = await this.alertController.create({
                  header: reauthTitle,
                  inputs: [
                    {
                      name: 'email',
                      type: 'email',
                      placeholder: emailPlaceholder,
                    },
                    {
                      name: 'password',
                      type: 'password',
                      placeholder: passwordPlaceholder,
                    },
                  ],
                  buttons: [
                    {
                      text: cancel,
                      role: 'cancel',
                    },
                    {
                      text: accept,
                      handler: async (data) => {
                        const credential = EmailAuthProvider.credential(data.email, data.password);
                        
                        const loading = await this.loadingCtrl.create({
                          message: loadingMessage,
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
                          FirebaseCrashlytics.log({
                            message: 'Error al reatuenticar la cuenta'
                          });

                          FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
                          FirebaseCrashlytics.setCustomKey({
                            key: 'pantalla cliente',
                            value: 'perfil_usuario',
                            type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
                          });
                          
                          await loading.dismiss(); // ⚠️ También ocultar en caso de error
                          const errorAlert = await this.alertController.create({
                            header: errorHeader,
                            message: deleteErrorMsg,
                            buttons: ['OK'],
                          });
                          await errorAlert.present();
                        }
                        await loading.dismiss(); // ✅ Ocultar loading al completar
                        this.presentToast("Su cuenta ha sido eliminada exitosamente", 'success');
                      },
                    },
                  ],
                });
  
                await alert.present();
              }
            } catch (error) {
              console.error('Error al eliminar la cuenta:', error);
              FirebaseCrashlytics.log({
                message: 'Error al eliminar la cuenta'
              });

              FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
              FirebaseCrashlytics.setCustomKey({
                key: 'pantalla cliente',
                value: 'perfil_usuario',
                type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
              });
              const errorAlert = await this.alertController.create({
                header: errorHeader,
                message: deleteFailMsg,
                buttons: ['OK'],
              });
  
              await errorAlert.present();
            }
          },
        },
        {
          text: cancel,
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
        const successMsg = await this.translate.get('EMAIL_VERIFICATION_RESENT').toPromise();
        this.presentToast(successMsg, 'success');
      }
    } catch (error) {
      console.error('Error al reenviar el correo de verificación:', error);
      FirebaseCrashlytics.log({
        message: 'Error al reenviar el correo'
     });

      FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
      FirebaseCrashlytics.setCustomKey({
        key: 'pantalla cliente',
        value: 'perfil_usuario',
        type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
      });
      const errorMsg = await this.translate.get('EMAIL_VERIFICATION_RESEND_ERROR').toPromise();
      this.presentToast(errorMsg, 'danger');
    }
  }

  async verificarEstado(){
    try {
      const user = await this.afAuth.currentUser;
      if (user && user.emailVerified) {
        const successMsg = await this.translate.get('EMAIL_VERIFIED_SUCCESS').toPromise();
        this.presentToast(successMsg, 'success');
        this.enviado = false;
      } else {
        const warningMsg = await this.translate.get('EMAIL_NOT_VERIFIED_YET').toPromise();
        this.presentToast(warningMsg, 'danger');
        this.enviado = true;
      }
    } catch (error) {
      console.error('Error al verificar el estado del correo:', error);
      FirebaseCrashlytics.log({
        message: 'Error al verificar el estado del correo'
      });

      FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
      FirebaseCrashlytics.setCustomKey({
        key: 'pantalla cliente',
        value: 'perfil_usuario',
        type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
      });
    }
  }

  async logout() {
  try {
    await this.authFire.signOut();   // Cierra sesión en Firebase
    
    // Limpia el objeto usuario para que no muestre nada
    this.usuario = { uid: '', nombre: '', movil: '', avatar: '', email: '' };
    
    // Opcional: redirige a login o inicio
    this.router.navigate(['/tabs/folder', this.usuario.uid], { replaceUrl: true });
  } catch (err) {
    console.error("❌ Error al cerrar sesión:", err);
    FirebaseCrashlytics.log({
      message: 'Error al cerrar sesion'
    });

    FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
    FirebaseCrashlytics.setCustomKey({
      key: 'pantalla cliente',
      value: 'perfil_usuario',
      type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
    });
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
