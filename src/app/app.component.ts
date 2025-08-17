import { Component, ElementRef, ViewChild } from '@angular/core';
import { UsuariosService } from './backend/usuarios.service';
import { FirestoreAuthService } from './service/firestore-auth.service';
import { FirestoreService } from './service/firestore.service';
import { Cita, Usuario } from './model';
import { Router } from '@angular/router';
import { NotificacionService } from './service/notificacion.service';
import { MenuController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { take } from 'rxjs';
import { UbicacionService } from './service/ubicacion.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef ;

  map!: google.maps.Map;
  
  showList = false;
  change = false;

  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    avatar: ''
  };
  userName="";
  uid = "";
  progress = true;
  

  toggleList() {
    this.showList = !this.showList;
  }

  constructor(private user: UsuariosService, public auth: FirestoreAuthService, public firestore: FirestoreService, public router: Router, public notificacion: NotificacionService,
              private menu: MenuController, private platform: Platform, public ubicacion: UbicacionService) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        await this.obtenerUsuario();
        this.router.navigate(['/tabs/folder', this.uid]);
      } else {
        this.uid= '';
        this.user.changeUserLogin(false);
        this.change = this.user.usuarioLogin;
        this.router.navigate(['/tabs/folder', this.uid]);
      }
    });
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
    });
  }
  

  ngOnInit() {
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
    this.user.changeUserLogin(false);
    this.change = this.user.usuarioLogin;
  }

  async checkConnectivityAndAuth() {
    const isOnline = navigator.onLine;

    if (!isOnline) {
      this.progress = false;
      return;
    }

    this.auth.stateAuth().pipe(take(1)).subscribe(async res => {
      console.log(res?.uid);
      if (res != null) {
        // RevenueCat
        this.usuario.uid = res.uid;

        // Establece la ubicación
        await this.ubicacion.obtenerUbicacionPrimero();

        // Navegación
        await this.router.navigate(['/tabs/folder', res.uid]);
        this.ocultarSplashScreen();

      } else {
        this.usuario.uid = '';
        await this.router.navigate(['/tabs/folder', this.usuario.uid]);
        this.ocultarSplashScreen();
      }
    });
  }

   ocultarSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      splashScreen.style.display ='none';
    }
  }
  
}
