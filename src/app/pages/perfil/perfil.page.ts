import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  uid ='';
  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  };

  constructor(public auth: FirestoreAuthService, public user: UsuariosService) { 
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

}
