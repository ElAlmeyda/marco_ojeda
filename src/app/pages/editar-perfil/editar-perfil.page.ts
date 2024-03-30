import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  uid ='';
  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  };

  actualizarUser: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  }
  

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, public toast: ToastController) { 
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        this.obtenerUsuario();
      } else {
        this.uid= '';
      }
    });
  }

  ngOnInit() {
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.usuario = usuario;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  async editar(){
    // Mostrar cuadro de diálogo de confirmación
    const confirmacion = window.confirm("¿Estás seguro de que deseas actualizar la información?");

  // Verificar si el usuario confirmó la acción
    if (confirmacion) {
      const check = await this.user.actualizarInfo(this.actualizarUser.nombre, this.actualizarUser.correo, this.actualizarUser.movil, this.actualizarUser.password, this.uid);
       if (check) {
        this.presentToast("Actualizado con éxito");
      } else {          
        this.presentToast("Actualizado fallido");
      }
    } else {
      this. actualizarUser= {
        nombre: '',
        uid: '',
        correo: '',
        movil: '',
        password: '',
        rol:''
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
