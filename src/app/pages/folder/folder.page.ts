import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  uid='';

  constructor(public afAuth: AngularFireAuth, public alertController: AlertController, public auth: FirestoreAuthService) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null){
        this.uid = res.uid;
        this.verificarCorreo();
      }
    });
   }


  ngOnInit() {
  }

  async verificarCorreo() {
    const user = await this.afAuth.currentUser;
    
    if (user) {
      if (!user.emailVerified) {
        const alert = await this.alertController.create({
          header: 'Correo no verificado',
          message: 'Tu correo aún no ha sido verificado. Ingresa el correo al que quieres enviar el correo de verificación.',
          inputs: [
            {
              name: 'correoVerificacion',
              type: 'email',
              placeholder: 'Ingresa tu correo para enviar la verificación',
              value: user.email,
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('El usuario canceló el envío del correo de verificación.');
              }
            },
            {
              text: 'Aceptar',
              handler: async (data) => {
                const correoVerificacion = data.correoVerificacion;
  
                // Verificar que el correo ingresado sea el mismo que el usuario tiene
                if (correoVerificacion !== user.email) {
                  const errorAlert = await this.alertController.create({
                    header: 'Error',
                    message: 'El correo ingresado no coincide con el correo actual.',
                    buttons: ['OK'],
                  });
                  await errorAlert.present();
                  return;
                }
  
                try {
                  // Enviar el correo de verificación
                  await user.sendEmailVerification();
                  const successAlert = await this.alertController.create({
                    header: 'Correo enviado',
                    message: 'Se ha enviado un correo de verificación a tu bandeja de entrada. Por favor, revisa tu correo.',
                    buttons: ['OK'],
                  });
                  await successAlert.present();
                } catch (error) {
                  console.error('Error al enviar el correo de verificación:', error);
                  const errorAlert = await this.alertController.create({
                    header: 'Error',
                    message: 'Hubo un error al intentar enviar el correo de verificación. Intenta de nuevo.',
                    buttons: ['OK'],
                  });
                  await errorAlert.present();
                }
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

}
