import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  newPassword: string='';
  oobCode: string='';
  mode: string='';
  modoContrasena = false;


  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'];
      this.oobCode = params['oobCode']; // Captura el código de acción
      this.mirarModo();
    });
  
  }

  mirarModo() {
    if (this.mode === 'resetPassword') {
      this.modoContrasena = true;
    } else if (this.mode === 'verifyEmail') {
      this.validarCorreo();
    }
  }

   async resetPassword() {
    try {
      await this.afAuth.confirmPasswordReset(this.oobCode, this.newPassword);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tu contraseña ha sido restablecida.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al restablecer la contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }


  async validarCorreo() {
    try {
      await this.afAuth.applyActionCode(this.oobCode);
      const alert = await this.alertController.create({
        header: 'Correo Verificado',
        message: 'Tu correo electrónico ha sido verificado con éxito.',
        buttons: ['OK']
      });
  
      await alert.present();
      alert.onDidDismiss().then(() => {
        this.router.navigate(['/folder']);
      });
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: `Hubo un error al verificar el correo: ${error.message}`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}