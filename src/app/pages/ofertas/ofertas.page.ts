import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Ofertas, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  ofertas: Ofertas[] = [];

  usuario: Usuario = {
      uid: '',
      nombre: '',
      correo: '',
    };

  constructor(public firestore: FirestoreService, public user: UsuariosService, public auth: FirestoreAuthService) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        
        this.usuario.uid = res.uid;
        this.obtenerUsuario();
        
      } else {
        this.usuario.uid= '';
      }
    });
   }

  ngOnInit() {
    this.firestore.getTodosLosAnuncios().subscribe(data => {
      this.ofertas = data;
      console.log("Todos los anuncios:", this.ofertas);
    });
  }


  async obtenerUsuario() {
    await this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.usuario.uid);
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }
}
