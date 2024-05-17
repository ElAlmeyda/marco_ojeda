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

  nombreInvalido: boolean = false;
  correoInvalido: boolean = false;
  passwordInvalido: boolean = false;
  movilInvalido: boolean = false;

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
        this.actualizarUser = usuario;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  async editar(){
    const check = await this.user.actualizarInfo(this.actualizarUser.nombre, this.actualizarUser.correo, this.actualizarUser.movil, this.actualizarUser.password, this.uid);
    if (check) {
      this.presentToast("Actualizado con éxito");
    } else {          
      this.presentToast("Actualizado fallido");
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

  validacionFormulario() {
    this.nombreInvalido = this.actualizarUser.nombre.length < 4;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.correoInvalido = !emailRegex.test(this.actualizarUser.correo);
    const passwordRegex = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}/;
    this.passwordInvalido = !passwordRegex.test(this.actualizarUser.password);
    this.movilInvalido = this.actualizarUser.movil.length !== 9;
  }

  mostrarErrorContrasena(){
    if (this.passwordInvalido) {
      this.presentToast("La contraseña debe tener al menos un número, una letra, un carácter especial y ser de al menos 6 caracteres de longitud.");
    }
  }
}
