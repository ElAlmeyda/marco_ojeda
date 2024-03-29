import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import {  Router } from '@angular/router';
import { first } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

  
  crearUser = {
    nombre: '',
    movil: '',
    correo: '',
    password: ''
  }

  usuario: Usuario[]=[];

  correcto = false;
  guardarEjecutado = false;


  constructor(private user: UsuariosService, public router: Router, public toast: ToastController) { }

  ngOnInit() {
  }
 


  async guardar(){
    const existeCorreo = this.user.verificarCorreoExiste(this.crearUser.correo); 
    if (!existeCorreo) {
      this.presentToast("Registrado fallido, el correo ya está asociado a otra cuenta");
    } else {
      const check = await this.user.createUser(this.crearUser.nombre, this.crearUser.correo, this.crearUser.password, this.crearUser.movil);
      if (check) {
        this.router.navigate(['/folder']);
        this.presentToast("Registrado con éxito");
      } else {          
      this.presentToast("Registrado fallido, ocurrió un error al crear el usuario");
      }
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
}
