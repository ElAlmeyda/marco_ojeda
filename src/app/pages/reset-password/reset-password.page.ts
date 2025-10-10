import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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
    private alertController: AlertController, public translate: TranslateService
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
        header: this.translate.instant('ALERT.SUCCESS'),
        message: this.translate.instant('RESET_PASSWORD.SUCCESS_MESSAGE'),
        buttons: [this.translate.instant('ALERT.OK')]
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ALERT.ERROR'),
        message: this.translate.instant('RESET_PASSWORD.ERROR_MESSAGE'),
        buttons: [this.translate.instant('ALERT.OK')]
      });
      await alert.present();
    }
  }

  async validarCorreo() {
    try {
      await this.afAuth.applyActionCode(this.oobCode);
      const alert = await this.alertController.create({
        header: this.translate.instant('ALERT.EMAIL_VERIFIED_HEADER'),
        message: this.translate.instant('VALIDATE_EMAIL.SUCCESS_MESSAGE'),
        buttons: [this.translate.instant('ALERT.OK')]
      });

      await alert.present();
      alert.onDidDismiss().then(() => {
        this.router.navigate(['/folder']);
      });
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ALERT.ERROR'),
        message: this.translate.instant('VALIDATE_EMAIL.ERROR_MESSAGE', { errorMsg: error.message }),
        buttons: [this.translate.instant('ALERT.OK')]
      });
      await alert.present();
    }
  }
}