import { Component } from '@angular/core';
import { UsuariosService } from './backend/usuarios.service';
import { FirestoreAuthService } from './service/firestore-auth.service';
import { FirestoreService } from './service/firestore.service';
import { Usuario } from './model';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  showList = false;
  change = false;

  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  };
  userName="";
  uid = "";

  public citas = [
    {
      dia :"13/02/2023",
      hora : "09:00"
    },
    {
      dia :"14/02/2023",
      hora : "10:00"
    }

];
  

  toggleList() {
    this.showList = !this.showList;
  }

  constructor(private user: UsuariosService, public auth: FirestoreAuthService, public firestore: FirestoreService) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        await this.obtenerUsuario();
      } else {
        this.uid= '';
        this.user.changeUserLogin(false);
        this.change = this.user.usuarioLogin;
      }
    });
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.usuario = usuario;
        this.userName = this.usuario.nombre;
        this.user.changeUserLogin(true);
        this.change = this.user.usuarioLogin;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  logout(){
    this.auth.logout();
    console.log(this.change);
    this.user.changeUserLogin(false);
    this.change = this.user.usuarioLogin;
  }
}
