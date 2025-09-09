import { Component, ElementRef, ViewChild } from '@angular/core';
import { UsuariosService } from './backend/usuarios.service';
import { FirestoreAuthService } from './service/firestore-auth.service';
import { FirestoreService } from './service/firestore.service';
import { Cita, Usuario } from './model';
import { NavigationEnd, Router } from '@angular/router';
import { NotificacionService } from './service/notificacion.service';
import { AlertController, MenuController, NavController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { take } from 'rxjs';
import { UbicacionService } from './service/ubicacion.service';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';


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
  isPremiun: any;
  

  toggleList() {
    this.showList = !this.showList;
  }

  constructor(private user: UsuariosService, public auth: FirestoreAuthService, public firestore: FirestoreService, public router: Router, public notificacion: NotificacionService,
              private menu: MenuController, private platform: Platform, public ubicacion: UbicacionService, private navController: NavController,  public alertController: AlertController) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        await this.obtenerUsuario();
        console.log("Uid",this.uid)
        this.isPremiun = await this.user.isPremium(this.uid);
        this.router.navigate(['/tabs/folder', this.uid]);
      } else {
        this.uid= '';
        this.isPremiun = false;
        this.user.changeUserLogin(false);
        this.change = this.user.usuarioLogin;
        this.router.navigate(['/tabs/folder', this.uid]);
      }
    });
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await AdMob.initialize();
      await AdMob.requestTrackingAuthorization();

      this.router.events.subscribe(event => {
        const currentRoute = this.router.url;
        if(!this.isPremiun){
          if (this.isInsideTabs(currentRoute)) {
            this.showBanner();
          } else {
            this.hideBanner();
          }
        }
      });
      this.handleBackButton();
    });

    
  }

  async showBanner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-1532953644939730/7244903225', // reemplaza con tu ID real
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 35 
    };
    await AdMob.showBanner(options);
  }

  async hideBanner() {
    await AdMob.removeBanner();
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
  
  handleBackButton() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      const currentRoute = this.router.url; // Obtén la ruta actual

      // Verifica si la ruta es una de las rutas de tabs
      if (this.isInsideTabs(currentRoute)) {
        const alert = await this.alertController.create({
          header: 'Salir de la aplicación',
          message: '¿Estás seguro de que deseas salir?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Salir',
              handler: () => {
                App.exitApp(); // Cierra la aplicación
              }
            }
          ]
        });
        await alert.present();
      } else {
        // Si no está dentro de tabs, navegar hacia atrás
        this.navController.back(); // Regresar a la pestaña anterior
      }
    });
  }

  // Función para verificar si la ruta actual está dentro de las pestañas
  isInsideTabs(route: string): boolean {
    // Verifica si la ruta actual corresponde a una de las rutas dentro de 'tabs'
    return route.startsWith('/tabs');
  }
}
