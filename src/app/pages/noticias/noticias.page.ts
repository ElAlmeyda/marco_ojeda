import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController, IonModal, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TiendaService } from 'src/app/backend/tienda.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Noticia, Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { NotificacionService } from 'src/app/service/notificacion.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  noticiaSeleccionada: any = null;
  uid='';
  noticias: Noticia [] = [];
  segmentoSeleccionado: string = 'recientes';
  estiloSeleccionado: string | null = null;
  estilos = [
    { nombre: 'Realismo', imagen: 'assets/estilos/realismo.jpg' },
    { nombre: 'Tradicional', imagen: 'assets/estilos/tradicional.jpg' },
    { nombre: 'Neotradicional', imagen: 'assets/estilos/neotradicional.jpg' },
    { nombre: 'Blackwork', imagen: 'assets/estilos/blackwork.jpg' },
    { nombre: 'Fineline', imagen: 'assets/estilos/fineline.jpg' },
    { nombre: 'Geométrico', imagen: 'assets/estilos/geometrico.jpg' },
    { nombre: 'Dotwork', imagen: 'assets/estilos/dotwork.jpg' },
    { nombre: 'Lettering', imagen: 'assets/estilos/lettering.jpg' },
    { nombre: 'Trash Polka', imagen: 'assets/estilos/trashpolka.jpg' },
    { nombre: 'Watercolor', imagen: 'assets/estilos/watercolor.jpg' },
    { nombre: 'Japanese', imagen: 'assets/estilos/japones.jpg' },
    { nombre: 'Tribal', imagen: 'assets/estilos/tribal.jpg' },
    { nombre: 'Surrealismo', imagen: 'assets/estilos/surrealismo.jpg' },
    { nombre: 'Biomecánico', imagen: 'assets/estilos/biomecanico.jpg' },
    { nombre: 'Anime', imagen: 'assets/estilos/anime.jpg' }
  ];
  cargando: any;
  bocetos: any[] = [];
  bocetosCargados = false;
  bocetoSeleccionado: any = null;
  bocetosFiltrados: any[] = [];
  bocetosFavoritos: any[] = [];

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

  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, private alertController: AlertController,
                public firestore: FirestoreService, public tiendaTatuador: TiendaService, private loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public toast: ToastController,
                 public notificacion: NotificacionService, public translate: TranslateService, private router: Router) { 
     this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
        this.obtenerUsuario();
      }
    });
  }

  ngOnInit() {
    this.obtenerNoticias();
  }

  cargarBocetosFavoritos() {
    if (!this.usuario.uid) return;

    this.tiendaTatuador.obtenerFavoritosFotos(this.usuario.uid).subscribe(favoritos => {
      this.bocetosFavoritos = favoritos || [];

      // Si ya tenemos bocetos cargados, los marcamos
      if (this.bocetosFiltrados.length > 0) {
        this.marcarBocetosFavoritos();
      }
    });
  }



  onSegmentChange(event: any) {
    this.segmentoSeleccionado = event.detail.value;

    if (this.segmentoSeleccionado === 'antiguas' && !this.bocetosCargados) {
      this.obtenerBocetos();
      this.cargarBocetosFavoritos();
    }
  }

  marcarBocetosFavoritos() {
    if (!this.bocetosFiltrados || !this.bocetosFavoritos) return;

    console.log("Marcando favoritos...");
    console.log("Bocetos:", JSON.stringify(this.bocetosFiltrados.slice(0, 5), null, 2));
    console.log("Favoritos:", JSON.stringify(this.bocetosFavoritos.slice(0, 5), null, 2));

    this.bocetosFiltrados = this.bocetosFiltrados.map(boceto => {
      const favorito = this.bocetosFavoritos.find(fav => {
        const favUrl = fav.url || fav.imagenUrl;
        const bocetoUrl = boceto.imagenUrl;
        return favUrl === bocetoUrl && fav.tatuadorId === boceto.uidTatuador;
      });

      console.log("Comparando:", boceto.imagenUrl, "→", favorito ? "ENCONTRADO ✅" : "no ❌");

      return {
        ...boceto,
        favorito: !!favorito,
        idFavorito: favorito ? favorito.id : null
      };
    });
  }


  async toggleFavoritoBoceto(boceto: any, event: Event) {
    event.stopPropagation();

    // 🔍 usa el tatuador del boceto si no hay this.tatuador
    const tatuadorId = this.tatuador?.uid || boceto.uidTatuador;

    if (!this.usuario?.uid) return;

    if (boceto.favorito && boceto.idFavorito) {
      // ❌ Eliminar de favoritos
      await this.tiendaTatuador.eliminarFavoritoFoto(this.usuario.uid, boceto.idFavorito);
      boceto.favorito = false;
      boceto.idFavorito = null;
    } else {
      // ❤️ Guardar como favorito
      const nuevoId = await this.tiendaTatuador.guardarFavoritoFoto(this.usuario.uid, tatuadorId, boceto.imagenUrl);
      boceto.favorito = true;
      boceto.idFavorito = nuevoId;
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


  obtenerNoticias(){
    this.firestore.getNoticias().subscribe(res => {
      this.noticias = res;
    })
  }

  obtenerBocetos() {
    if (this.bocetosCargados) return;
    this.cargando = true;

    this.firestore.obtenerTodosLosBocetos().subscribe({
      next: (data) => {
        this.bocetos = data;
        this.bocetosFiltrados = [...this.bocetos];
        this.cargando = false;
        this.bocetosCargados = true;

        // Si ya tenemos favoritos cargados, los marcamos
        if (this.bocetosFavoritos.length > 0) {
          this.marcarBocetosFavoritos();
        }
      },
      error: (err) => {
        console.error('Error cargando bocetos', err);
        this.cargando = false;
      }
    });
  }


  abrirModal(noticia: any) {
    this.noticiaSeleccionada = noticia;
    this.modal.present();
  }

  cerrarModal() {
    this.modal.dismiss();
  }

  seleccionarEstilo(estilo: any) {
    console.log("Estilo seleccionado:", estilo.nombre);
    // Alternar selección
    this.estiloSeleccionado = this.estiloSeleccionado === estilo.nombre ? null : estilo.nombre;
    // Filtrar
    this.buscarEstilos();
  }

  // Filtrar por estilo temporalmente
  buscarEstilos() {
    if (!this.estiloSeleccionado) {
      // Si no hay estilo seleccionado, volvemos a mostrar la lista original
      this.bocetosFiltrados = [...this.bocetos];
    } else {
      // Filtrar solo los bocetos que coincidan con el estilo
      this.bocetosFiltrados = this.bocetos.filter(b => b.estilo === this.estiloSeleccionado);
    }
  }

  seleccionarBoceto(boceto: any) {
    this.bocetoSeleccionado = boceto;
    this.obtenerTatuador();
  }

  volverLista() {
    this.bocetoSeleccionado = null;
  }

  async obtenerTatuador() {
    this.tiendaTatuador.getTatuadorById(this.bocetoSeleccionado.uidTatuador).subscribe(async data => {
      if (data) {
        this.tatuador = data;
         this.tiendaTatuador.getAvataresDeTatuador(this.bocetoSeleccionado.uidTatuador).subscribe(avatares => {
          if(avatares){
            this.tatuador.avatar = avatares; // un array sólo con URLs válidas
            console.log(this.tatuador.avatar);
          }
        });
      } else {
        console.warn('No se encontró el tatuador');
      }
    });
  }

  get avatarUrl(): string {
    const avatar = this.tatuador?.avatar;

    if (typeof avatar === 'string' && avatar.trim() !== '') {
      return avatar;
    }

    return 'assets/icon/sin_avatar.png';
  }


  abrirMaps(direccion: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  }

  async consultaPrevia() {
    if (this.usuario.uid) {
      const uidTatuador = this.tatuador.uid;

      const boceto = {
        descripcion: this.bocetoSeleccionado.descripcion,
        estilo: this.bocetoSeleccionado.estilo,
      };
      
      await this.router.navigate(['/pedir-cita', uidTatuador], {
        queryParams: {
          consulta: true,
          boceto: JSON.stringify(boceto)
        }
      });
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
}
