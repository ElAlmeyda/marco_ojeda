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
  rol="cliente";

  usuario: Usuario[]=[];

  correcto = false;
  guardarEjecutado = false;


  constructor(private user: UsuariosService, public router: Router, public toast: ToastController) { }

  ngOnInit() {
  }
 


  async guardar(){
    const existeCorreo = this.user.verificarCorreoExiste(this.crearUser.correo); 
    if (!existeCorreo) {
      this.presentToast("Registrado fallido, el correo ya está asociado a otra cuenta", 'danger');
    } else {
      const check = await this.user.createUser(this.crearUser.nombre, this.crearUser.correo, this.crearUser.password, this.crearUser.movil, this.rol);
      if (check) {
        this.router.navigate(['/folder']);
        this.presentToast("Registrado con éxito", 'success');
      } else {          
      this.presentToast("Registrado fallido, ocurrió un error al crear el usuario", 'danger');
      }
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
