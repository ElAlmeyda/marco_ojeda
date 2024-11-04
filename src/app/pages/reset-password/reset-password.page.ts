import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  newPassword: string='';
  oobCode: string='';

  
  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    public user: UsuariosService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode']; // Captura el código de acción
    });
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
      this.router.navigate(['/login']); // Redirigir al inicio de sesión
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  
}
