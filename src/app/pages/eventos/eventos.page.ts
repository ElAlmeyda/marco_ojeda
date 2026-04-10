import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TiendaService } from 'src/app/backend/tienda.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Cita, Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  tatuadoresDelEvento: Tatuador[] = [];
  evento: any[] = [];
  eventoSeleccionado: any = null;
  tatuadorSeleccionado: any = null;
   usuario: Usuario = {
      uid: '',
      nombre: '',
      email: '',
    };
  cita: Cita = {} as Cita;consultaTrue: any;
  datosConsulta = {
    nombre: '',
    diseno: '',
    ubicacion: '',
    tamano: '',
    color: '',
    notas: '',
    tatuador: '',
    telefono: '',
    email: '',
    predeterminado: ''
  };

  mensaje='';
  tipo='';
  zona='';
  alergias='';
  estilo='';
  aceptoTatuador = false;
  acepto= false;

  constructor(public auth: FirestoreAuthService, public tiendaTatuador: TiendaService, public user: UsuariosService, public toast: ToastController, public firestore: FirestoreService, 
              public translate: TranslateService, public navCtrl: NavController, public router: Router) {
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
    this.obtenerOventos();
  }

  async obtenerUsuario() {
    await this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.usuario.uid);
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }

  volver(){
    if(this.eventoSeleccionado){
      this.eventoSeleccionado = null
    } else {
      this.router.navigate(['/tabs/folder', ""]);
    }
  }

  volverEvento(){
    if(this.tatuadorSeleccionado){
      this.tatuadorSeleccionado = null
    }
  }

  obtenerOventos(){
    this.firestore.getEvento().subscribe(res => {
      console.log("Res evento:", JSON.stringify(res));

      this.evento = res;
    })
  }

  async obtenerTatuadoresDelEvento(eventoId: string) {
    this.firestore.getEventoPorId(eventoId).subscribe((evento: any) => {
      console.log('Evento seleccionado:', evento);

      if (evento?.tatuadores && evento.tatuadores.length > 0) {
        this.firestore.getTatuadoresPorUIDs(evento.tatuadores).subscribe(tatuadores => {
          console.log('Tatuadores del evento:', tatuadores);

          // Guardamos los tatuadores base
          this.tatuadoresDelEvento = tatuadores;

          // 🔹 Ahora cargamos los avatares para cada uno
          this.tatuadoresDelEvento.forEach((tatuador: any, index) => {
            this.tiendaTatuador.getAvataresDeTatuador(tatuador.uid).subscribe(fotos => {
              tatuador.avatar = fotos ?? ''; 
            });
          });
        });
      } else {
        this.tatuadoresDelEvento = [];
        console.warn('Este evento no tiene tatuadores asociados.');
      }
    });
  }




  seleccionarEvento(evento: any) {
    this.eventoSeleccionado = evento;
    this.obtenerTatuadoresDelEvento(evento.id);

    this.mensaje = `Me gustaría ser tu modelo para la convención de ${evento.nombre || evento.titulo || ''}`;
  }

   abrirMaps(direccion: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  }
  
  seleccionarTatuador(evento: any) {
    this.tatuadorSeleccionado = evento;
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

  abrirPDF() {
    console.log("Consentimiento", this.tatuadorSeleccionado.consentimientoUrl);
    window.open(this.tatuadorSeleccionado.consentimientoUrl, '_blank');
  }

  async guardarConsulta() {
    console.log(this.acepto);
    if (!this.cita) this.cita = {} as Cita;
  
    if(!this.acepto){
      this.presentToast(this.translate.instant('APPOINTMENT.ACCEPT_CONDITIONS'), "danger");
      return; // salir si no acepta
    }
  
    if(this.usuario.movil){
        // Rellenar la cita
      this.datosConsulta.nombre = this.usuario.nombre
      this.datosConsulta.telefono = this.usuario.movil
      this.datosConsulta.email = this.usuario.email
      this.datosConsulta.diseno = this.estilo
      this.datosConsulta.notas = this.mensaje 
      this.datosConsulta.tatuador = this.tatuadorSeleccionado.nombre
      this.datosConsulta.ubicacion = this.zona
  
      try {
        await this.tiendaTatuador.guardarConsulta(this.datosConsulta, this.usuario.uid, this.tatuadorSeleccionado.uid);
        await this.presentToast(this.translate.instant('APPOINTMENT.SAVED_SUCCESS'), "success");
      } catch (err) {
        console.error(err);
        FirebaseCrashlytics.log({
          message: 'Error al guardar consulta de evento'
        });

        FirebaseCrashlytics.setUserId({ userId: this.usuario.uid });
        FirebaseCrashlytics.setCustomKey({
          key: 'pantalla cliente',
          value: 'perfil_usuario',
          type: 'string' // obligatorio: 'string' | 'number' | 'boolean'
        });
        this.presentToast(this.translate.instant('APPOINTMENT.MISSING_FIELDS'), "danger");
      }
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
