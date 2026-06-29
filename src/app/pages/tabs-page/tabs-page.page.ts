import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/backend/theme.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.page.html',
  styleUrls: ['./tabs-page.page.scss'],
})
export class TabsPagePage implements OnInit {

  uid='';
  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };
  imagen: string = '';
  temaActual: 'dark' | 'light' = 'dark';

  constructor(private themeService: ThemeService, public firestroreAuth: FirestoreAuthService, public user: UsuariosService) {
    this.temaActual = this.themeService.getTemaActual();

    this.temaActual = this.themeService.getTemaActual();
    this.firestroreAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
      } else {
        this.usuario.uid= '';
         this.obtenerUsuario();
      }
    });
   }

  ngOnInit() {
  }

  

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.usuario.uid);
      if (usuario) {
        this.usuario = usuario;
        this.user.getAvatar(this.usuario.uid).subscribe((fotos: string) => {
          this.imagen = fotos; // Ahora `this.imagen` tendrá las URLs correctamente
        });
      } else {
      }
    });
  }

}
