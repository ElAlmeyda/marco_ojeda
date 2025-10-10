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
              private afAuth: AngularFireAuth, public translate: TranslateService, public router: Router, public toast: ToastController, private loadingCtrl: LoadingController, public authFire: AngularFireAuth) {  
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

  async cambioContrasena() {
    const user = await this.afAuth.currentUser;

    if (user) {
      if (!user.emailVerified) {
        const header = await this.translate.get('PASSWORD_CHANGE_TITLE').toPromise();
        const message = await this.translate.get('PASSWORD_CHANGE_MESSAGE').toPromise();
        const cancelText = await this.translate.get('CANCEL').toPromise();
        const acceptText = await this.translate.get('ACCEPT').toPromise();

        const alert = await this.alertController.create({
          header,
          message,
          buttons: [
            {
              text: cancelText,
              role: 'cancel'
            },
            {
              text: acceptText,
              handler: async () => {
                await this.auth.resetPassword(this.usuario.correo);
                const successMsg = await this.translate.get('PASSWORD_CHANGE_SUCCESS').toPromise();
                this.presentToast(successMsg, 'success');
              }
            }
          ]
        });

        await alert.present();
      }
    } else {
      const header = await this.translate.get('ERROR').toPromise();
      const message = await this.translate.get('USER_FETCH_ERROR').toPromise();

      const errorAlert = await this.alertController.create({
        header,
        message,
        buttons: ['OK']
      });

      await errorAlert.present();
    }
  }


  async showActionSheet(campo: string) {
    const user = await this.afAuth.currentUser;

    if (user) {
      if (user.emailVerified) {
        try {
          if (user.email !== this.usuario.correo) {
            await this.reautenticarUsuario(user);
            await user.updateEmail(this.usuario.correo);
            const check = await this.user.updateCorreo(this.nuevoCorreo, this.usuario.uid);

            if (check) {
              const successMsg = await this.translate.get('EMAIL_UPDATE_SUCCESS').toPromise();
              this.presentToast(successMsg, 'success');
            } else {
              const failMsg = await this.translate.get('EMAIL_UPDATE_FAIL').toPromise();
              this.presentToast(failMsg, 'danger');
            }
          }

          if (user.email !== this.usuario.correo) {
            await user.sendEmailVerification();
          }

        } catch (error) {
          console.error("Error al actualizar el correo:", error);
          const errorMsg = await this.translate.get('EMAIL_UPDATE_ERROR').toPromise();
          this.presentToast(errorMsg, 'danger');
        }
      } else {
        const warningMsg = await this.translate.get('EMAIL_NOT_VERIFIED').toPromise();
        this.presentToast(warningMsg, 'danger');
        await user.sendEmailVerification();
      }
    }
  }

  async reautenticarUsuario(user: any) {
    try {
      const [header, emailPlaceholder, passwordPlaceholder, cancel, confirm, errorMsg] = await Promise.all([
        this.translate.get('REAUTH_TITLE').toPromise(),
        this.translate.get('EMAIL').toPromise(),
        this.translate.get('PASSWORD').toPromise(),
        this.translate.get('CANCEL').toPromise(),
        this.translate.get('CONFIRM').toPromise(),
        this.translate.get('REAUTH_FAIL').toPromise()
      ]);

      const alert = await this.alertController.create({
        header,
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
            placeholder: passwordPlaceholder
          }
        ],
        buttons: [
          {
            text: cancel,
            role: 'cancel'
          },
          {
            text: confirm,
            handler: async (data) => {
              try {
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
      header,
      message,
      buttons: [
        {
          text: accept,
          handler: async () => {
            try {
              const user = await this.afAuth.currentUser;

              if (user) {
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
                    }
                  ],
                  buttons: [
                    {
                      text: cancel,
                      role: 'cancel'
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
                          await user.reauthenticateWithCredential(credential);
                          await this.user.marcarUsuarioComoEliminado(this.usuario, user.uid);
                          await user.delete();
                          this.logout();
                        } catch (reauthError) {
                          console.error('Error al reautenticar o eliminar:', reauthError);
                          await loading.dismiss();

                          const errorAlert = await this.alertController.create({
                            header: errorHeader,
                            message: deleteErrorMsg,
                            buttons: ['OK'],
                          });
                          await errorAlert.present();
                        }

                        await loading.dismiss();
                      }
                    }
                  ]
                });

                await alert.present();
              }
            } catch (error) {
              console.error('Error al eliminar la cuenta:', error);

              const errorAlert = await this.alertController.create({
                header: errorHeader,
                message: deleteFailMsg,
                buttons: ['OK']
              });

              await errorAlert.present();
            }
          }
        },
        {
          text: cancel,
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async reenviarCorreo() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.sendEmailVerification();
        const successMsg = await this.translate.get('EMAIL_VERIFICATION_RESENT').toPromise();
        this.presentToast(successMsg, 'success');
      }
    } catch (error) {
      console.error('Error al reenviar el correo de verificación:', error);
      const errorMsg = await this.translate.get('EMAIL_VERIFICATION_RESEND_ERROR').toPromise();
      this.presentToast(errorMsg, 'danger');
    }
  }

  async verificarEstado() {
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
