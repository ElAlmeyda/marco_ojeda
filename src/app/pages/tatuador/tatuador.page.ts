import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TiendaService } from 'src/app/backend/tienda.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Resena, Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-tatuador',
  templateUrl: './tatuador.page.html',
  styleUrls: ['./tatuador.page.scss'],
})
export class TatuadorPage implements OnInit {

  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };
  imagenSeleccionada: string | null = null;
  datosConsulta = {
    nombre: '',
    diseno: '',
    ubicacion: '',
    tamano: '',
    color: '',
    notas: '',
    tatuador: '',
    telefono: '',
    correo: ''
  };
  objetivos = [
    { nombre: '100 citas', alcanzado: false, activated: false, img: 'assets/objetivos/100citas.png' },
    { nombre: '250 citas', alcanzado: false, activated: false, img: 'assets/objetivos/250citas.png' },
    { nombre: '500 citas', alcanzado: false, activated: false, img: 'assets/objetivos/500citas.png' },
    { nombre: '1000 citas', alcanzado: false, activated: false, img: 'assets/objetivos/1000citas.png' },
    { nombre: '100 reseñas', alcanzado: false, activated: false, img: 'assets/objetivos/100resenas.png' },
    { nombre: '250 reseñas', alcanzado: false, activated: false, img: 'assets/objetivos/250resenas.png' },
    { nombre: '500 reseñas', alcanzado: false, activated: false, img: 'assets/objetivos/500resenas.png' },
    { nombre: '1 año', alcanzado: false, activated: false, img: 'assets/objetivos/1ano.png' },
    { nombre: '2 años', alcanzado: false, activated: false, img: 'assets/objetivos/2anos.png' },
  ];
  imagenResena: string | null = null; // base64 para preview
  imagenFile: File | null = null;
  previewImage: string | null = null;

  tatuador: Tatuador = {
    nombre: '',
    nombreTienda: '',
    telefono: '',
    biografia: '',
    foto: [],
    avatar: '',
    precio: 0,
    uid: '',
  }
  uid='';

  favorito=false;

  avatars: string='';
  diasResumen: string = '';
  horasResumen: string = '';
  resenas!: Resena [];
  estrellaSeleccionada: number = 0;
  mensajeResena: string = '';
  resenaExistente: boolean = false;

  resenaActual = 0;

  segmentoSeleccionado: string = 'info';

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, private route: ActivatedRoute, public tiendaTatuador: TiendaService, public toast: ToastController,
    private router: Router, public navCtrl: NavController, private alertController: AlertController, public translate: TranslateService, private platform: Platform, public toastCtrl: ToastController
  ) {
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
    this.uid = this.route.snapshot.paramMap.get('uid') || '';

    this.obtenerTatuador();
  }


  volver(){
    this.navCtrl.back();
  }


  siguienteResena() {
    if (this.resenas.length > 0) {
      this.resenaActual = (this.resenaActual + 1) % this.resenas.length;
    }
  }

  anteriorResena() {
    if (this.resenas.length > 0) {
      this.resenaActual =
        (this.resenaActual - 1 + this.resenas.length) % this.resenas.length;
    }
  }
  

   async obtenerUsuario() {
    await this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.usuario.uid);
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }

  async obtenerTatuador() {
    this.tiendaTatuador.getTatuadorById(this.uid).subscribe(async data => {
      if (data) {
        this.tatuador = data;
         this.tiendaTatuador.getAvataresDeTatuador(this.uid).subscribe(avatares => {
          if(avatares)
          this.tatuador.avatar = avatares; // un array sólo con URLs válidas
        });
        this.tiendaTatuador.getFotosTatuador(this.uid).subscribe(fotos => {
          this.tatuador.foto = fotos;
        });

       if (this.usuario.uid) {
          this.tiendaTatuador.verificarFavorito(this.usuario.uid, this.uid).then(esFavorito => {
            this.favorito = esFavorito;
          });
        }
        await this.cargarResenas();
        this.verificarSiYaReseno();
        this.actualizarObjetivos();
      } else {
        console.warn('No se encontró el tatuador');
      }
    });
  }

  async ponerFavorito() {
    if(this.usuario.uid){
      await this.tiendaTatuador.agregarFavorito(this.usuario.uid, this.tatuador);
      this.favorito = true;
    } else {
      this.presentToast(this.translate.instant('LOGIN_REQUIRED'), 'warning');
    }
  }

  async quitarFavorito() {
    if(this.usuario.uid){
      await this.tiendaTatuador.quitarFavorito(this.usuario.uid, this.tatuador.uid);
      this.favorito = false;
    } else {
      this.presentToast(this.translate.instant('LOGIN_REQUIRED'), 'warning');
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


  async pedirCita() {
    if (this.usuario.uid) {
      const alert = await this.alertController.create({
        header: this.translate.instant('WARNING'),
        message: this.translate.instant('APPOINTMENT_WARNING'),
        buttons: [
          {
            text: this.translate.instant('CANCEL'),
            role: 'cancel'
          },
          {
            text: this.translate.instant('CONTINUE'),
            handler: async () => {
              const uidTatuador = this.tatuador.uid;
              await this.router.navigate(['/pedir-cita', uidTatuador]);
            }
          }
        ]
      });

      await alert.present();
    } else {
      const mensaje = this.translate.instant('LOGIN_REQUIRED_APPOINTMENT');
      this.presentToast(mensaje, 'warning');
    }
  }



  async enviarResena() {
    if (this.estrellaSeleccionada === 0 || !this.mensajeResena.trim()) {
      this.presentToast(this.translate.instant('REVIEW_REQUIRED'), 'warning');
      return;
    }

    const uidUsuario = this.usuario.uid;
    const uidTatuador = this.tatuador.uid;

    const resena: any = {
      estrella: this.estrellaSeleccionada,
      mensaje: this.mensajeResena.trim(),
      nombreUsuario: this.usuario.nombre
    };

    if (this.imagenFile) {
      // Subir imagen a tu backend o Firebase
      const urlImagen = await this.user.subirImagenResena([this.imagenFile], uidUsuario, uidTatuador);
      resena.imagen = urlImagen;
    }

    this.tiendaTatuador.guardarResena(resena, uidUsuario, uidTatuador);

    // Limpiar campos
    this.estrellaSeleccionada = 0;
    this.mensajeResena = '';
    this.imagenResena = null;
    this.imagenFile = null;
    this.resenaExistente = true;
    this.cargarResenas();
  } 

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  cargarResenas() {
    const uidTatuador = this.tatuador.uid;
    this.tiendaTatuador.getResenaTatuador(uidTatuador).subscribe(res => {
      this.resenas = res as Resena[];
      console.log(this.resenas);
    });
  }

  getArray(length: number | undefined | null): any[] {
    const safe = Math.max(0, Math.min(5, Number(length) || 0));
    return Array(safe).fill(0);
  }


  verificarSiYaReseno() {
    // Comprobar que el usuario está logueado
    if (!this.usuario || !this.usuario.uid) {
      console.log('Usuario no logueado, no se puede verificar la reseña.');
      this.resenaExistente = false; // opcional, para deshabilitar UI
      return;
    }

    const uidUsuario = this.usuario.uid;
    const uidTatuador = this.tatuador.uid;

    this.tiendaTatuador.existeResena(uidUsuario, uidTatuador).subscribe(
      (existe) => {
        this.resenaExistente = existe;
      },
      (error) => {
        console.error('Error al verificar reseña:', error);
      }
    );
  }


  seleccionarEstrella(valor: number) {
    this.estrellaSeleccionada = valor;
  }

  abrirRedSocial(red: string, usuario: string) {
    if (!usuario) return;

    let url = '';

    switch (red) {
      case 'instagram':
        url = `https://instagram.com/${usuario}`;
        break;
      case 'facebook':
        url = `https://facebook.com/${usuario}`;
        break;
      case 'tiktok':
        url = `https://www.tiktok.com/@${usuario}`;
        break;
      case 'twitter':
        url = `https://twitter.com/${usuario}`;
        break;
      default:
        return; // No reconocida
    }

    window.open(url, '_blank');
  }

  abrirWhatsapp(telefono: string) {
    if (telefono) {
      const url = `https://wa.me/${telefono}`;
      window.open(url, '_blank');
    }
  }

  abrirSitioWeb(url: string) {
    if (url) {
      const sitio = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
      window.open(sitio, '_blank');
    }
  }


  get avatarUrl(): string {
    const avatar = this.tatuador?.avatar;

    // Verifica que avatar sea una cadena y no vacía
    if (typeof avatar === 'string' && avatar.trim() !== '') {
      return avatar;
    }

    // Si no es válido, regresa la imagen por defecto
    return 'assets/icon/sin_avatar.png';
  }

  async consultaPrevia() {
    if (this.usuario.uid) {
      const uidTatuador = this.tatuador.uid;
      await this.router.navigate(['/pedir-cita', uidTatuador], {
        queryParams: {
          consulta: true
        }
      });
    } else {
      this.presentToast(this.translate.instant('LOGIN_REQUIRED'), 'warning');
    }
  }

  verImagen(foto: string) {
    this.imagenSeleccionada = foto;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  actualizarObjetivos() {
    // Si es un array lo convertimos en objeto vacío
    console.log(this.tatuador.objetivos);
    const objetivosUsuario: Record<string, boolean> = 
      (this.tatuador.objetivos && !Array.isArray(this.tatuador.objetivos)) 
        ? this.tatuador.objetivos 
        : {};

    this.objetivos = this.objetivos.map(obj => {
      const key = obj.nombre.replace(/\s+/g, '_').toLowerCase(); // "100 citas" → "100_citas"
      return {
        ...obj,
        alcanzado: objetivosUsuario[key] === true
      };
    });
  }
  
  abrirMaps(direccion: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  }

  async compartirPerfil() {
    const enlace = `https://itattoo-9f978.web.app/tatuador/${this.usuario.uid}`;
    await Clipboard.write({ string: enlace });
    const toast = await this.toastCtrl.create({
      message: '🔗 Enlace copiado al portapapeles',
      duration: 2000,
      position: 'bottom',
      color: 'dark', // opcional: "primary", "light", "success", etc.
    });
    await toast.present();
  }
}
