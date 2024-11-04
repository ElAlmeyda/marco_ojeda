import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email: string='';


  constructor(
    private authService: FirestoreAuthService,
    private router: Router,
    private alertController: AlertController,
    public user: UsuariosService
  ) {
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async resetPassword() {
    try {
      await this.authService.resetPassword(this.email);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Revisa tu correo para restablecer tu contraseña.',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/inicio-sesion']); // Redirige al inicio de sesión
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

}
