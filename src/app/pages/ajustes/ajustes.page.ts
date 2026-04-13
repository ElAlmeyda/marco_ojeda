import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonModal, NavController, ToastController } from '@ionic/angular';
import { Cita, Resena, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { App } from '@capacitor/app';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { TiendaService } from 'src/app/backend/tienda.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  
  usuarioActual: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
    token: ''
  };
  isDarkMode: boolean = false;
  selectedTheme: string = 'isSystem';
  imagenSeleccionada: string | null = null;

  uid='';
  isAyuda=false;
  isUSo=false;
  isPrivacidad=false;
  isCondicion=false;
  isCondicionUso=false;
  isInformacion=false;
  isAjustes=false;
  isResena=false;
  isHistorial=false;
  isModalOpen = false;
  resenaSeleccionada: any = null;
  citas: Cita [] = [];
  resenas: Resena [] = [];
  imagen: string[] = [];
  estrellaSeleccionada: number = 0;
  mensajeResena: string = '';

  usuariosBloqueados: Usuario[] = [];
  preguntas = [
    { titulo: 'FAQ.P1.TITLE', respuesta: 'FAQ.P1.ANSWER', abierto: false },
    { titulo: 'FAQ.P2.TITLE', respuesta: 'FAQ.P2.ANSWER', abierto: false },
    { titulo: 'FAQ.P3.TITLE', respuesta: 'FAQ.P3.ANSWER', abierto: false },
    { titulo: 'FAQ.P4.TITLE', respuesta: 'FAQ.P4.ANSWER', abierto: false },
    { titulo: 'FAQ.P5.TITLE', respuesta: 'FAQ.P5.ANSWER', abierto: false },
    { titulo: 'FAQ.P6.TITLE', respuesta: 'FAQ.P6.ANSWER', abierto: false },
    { titulo: 'FAQ.P7.TITLE', respuesta: 'FAQ.P7.ANSWER', abierto: false },
    { titulo: 'FAQ.P8.TITLE', respuesta: 'FAQ.P8.ANSWER', abierto: false },
    { titulo: 'FAQ.P9.TITLE', respuesta: 'FAQ.P9.ANSWER', abierto: false },
    { titulo: 'FAQ.P10.TITLE', respuesta: 'FAQ.P10.ANSWER', abierto: false },
    { titulo: 'FAQ.P11.TITLE', respuesta: 'FAQ.P11.ANSWER', abierto: false },
    { titulo: 'FAQ.P12.TITLE', respuesta: 'FAQ.P12.ANSWER', abierto: false },
    { titulo: 'FAQ.P13.TITLE', respuesta: 'FAQ.P13.ANSWER', abierto: false },
    { titulo: 'FAQ.P14.TITLE', respuesta: 'FAQ.P14.ANSWER', abierto: false },
    { titulo: 'FAQ.P15.TITLE', respuesta: 'FAQ.P15.ANSWER', abierto: false },
    { titulo: 'FAQ.P16.TITLE', respuesta: 'FAQ.P16.ANSWER', abierto: false },
    { titulo: 'FAQ.P17.TITLE', respuesta: 'FAQ.P17.ANSWER', abierto: false },
    { titulo: 'FAQ.P18.TITLE', respuesta: 'FAQ.P18.ANSWER', abierto: false },
    { titulo: 'FAQ.P19.TITLE', respuesta: 'FAQ.P19.ANSWER', abierto: false },
    { titulo: 'FAQ.P20.TITLE', respuesta: 'FAQ.P20.ANSWER', abierto: false }
  ];

  isPago: any;
  isPremium: any;


  constructor(public firestore: FirestoreService, public user: UsuariosService, private navCtrl: NavController, public auth: FirestoreAuthService, public tiendaService: TiendaService,
              private route: ActivatedRoute, public alertController: AlertController, private actionSheetController: ActionSheetController, private toastController: ToastController,
              private router: Router, public translate: TranslateService, public storage: Storage
  ) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuarioActual.uid = res.uid;
        this.obtenerUsuario();
      } 
    });
    this.route.queryParams.subscribe(queryParams => {
      this.isAyuda = queryParams['isAyuda'];  
      this.isPrivacidad = queryParams['isPrivacidad'];  
      this.isUSo = queryParams['isUSo']; 
      this.isCondicion = queryParams['isCondicion']; 
      this.isCondicionUso = queryParams['isCondicionUso']; 
      this.isInformacion = queryParams['isInformacion']; 
      this.isAjustes = queryParams['isAjustes']; 
      this.isHistorial = queryParams['isHistorial']; 
      this.isResena = queryParams['isResena']; 
      this.isPago = queryParams['isPago']; 
      this.obtenerUsuario();
      this.isDarkMode = document.body.classList.contains('dark');
      this.loadTheme();
    });
  }

   cargarPreguntas() {
    const keys = Array.from({length: 20}, (_, i) => `P${i+1}`); // P1, P2, ..., P20
    
    this.preguntas = keys.map(key => ({
      titulo: this.translate.instant(`FAQ.${key}.TITLE`),
      respuesta: this.translate.instant(`FAQ.${key}.ANSWER`),
      abierto: false
    }));
  }

  async cambiarIdioma(lang: string) {
    this.translate.use(lang);
    await this.storage.set('app_language', lang);
    this.cargarPreguntas();
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(async () => {
      const usuario = this.user.getUsuarioConcreto(this.usuarioActual.uid);
      if (usuario) {
        this.usuarioActual = usuario;
        this.isPremium = await this.user.isPremium(this.usuarioActual.uid);
        if(this.isResena){
          this.obtenerResenas();
        }
        if(this.isHistorial){
          this.obtenerHistorial();
        }
      }
    });
  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  obtenerResenas() {
    this.tiendaService.getResenaUsuario(this.usuarioActual.uid).subscribe((resenas: any[]) => {
      this.resenas = resenas;
      this.resenas.forEach(async (resena) => {
        if(resena.uidTatuador){
          this.tiendaService.getTatuadorById(resena.uidTatuador).subscribe(async data => {
            console.log(data);
            resena.nombreTatuador = data?.nombreTienda;
          });
        }
      });
    });
  }

  editarResena(resena: any) {
    const nuevaResena = {
      ...resena,
      mensaje: this.mensajeResena,
      estrella: this.estrellaSeleccionada
    };

    this.tiendaService.actualizarResena(
      resena.uidCliente,
      resena.uidTatuador,
      resena.id,
      nuevaResena
    ).then(() => {
      console.log('Reseña actualizada');
      this.obtenerResenas(); // recarga
    });
    this.setOpen(false);
    this.presentToast(this.translate.instant('REVIEW_UPDATED'));
  }


  setOpen(open: boolean, resena?: any) {
    this.isModalOpen = open;

    if (open && resena) {
      this.resenaSeleccionada = resena;
      this.mensajeResena = resena.mensaje;
      this.estrellaSeleccionada = resena.puntuacion || resena.estrella || 1;
    }

    if (!open) {
      // Limpiar al cerrar
      this.resenaSeleccionada = null;
      this.mensajeResena = '';
      this.estrellaSeleccionada = 0;
    }
  }

   seleccionarEstrella(valor: number) {
    this.estrellaSeleccionada = valor;
  }

  async eliminarResena(resena: any) {
    const alert = await this.alertController.create({
      header: this.translate.instant('DELETE_REVIEW'),
      message: this.translate.instant('DELETE_REVIEW_CONFIRM'),
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
            console.log(this.translate.instant('DELETE_CANCELLED'));
          }
        },
        {
          text: this.translate.instant('DELETE'),
          role: 'destructive',
          handler: () => {
            this.tiendaService
              .eliminarResena(this.usuarioActual.uid, resena.uidTatuador, resena.id)
              .then(() => {
                console.log(this.translate.instant('REVIEW_DELETED'));
                this.obtenerResenas(); // Recarga la lista
              })
              .catch(err => {
                console.error('Error eliminando la reseña:', err);
              });
          }
        }
      ]
    });

    await alert.present();
  }


  obtenerHistorial() {
    this.tiendaService.getCitasUsuario(this.usuarioActual.uid).subscribe((citas: any[]) => {

      const ahora = new Date();

      this.citas = citas.filter(cita => {
        // Crear fecha completa con hora
        const fechaCita = new Date(cita.dia);
        const [hora, minuto] = cita.hora.split(':').map(Number);
        fechaCita.setHours(hora, minuto, 0, 0);

        // Solo citas aceptadas que ya hayan pasado
        return cita.estado === 'Aceptado' && fechaCita.getTime() < ahora.getTime();
      });

      // Ordenar del más reciente al más antiguo (opcional pero recomendable en historial)
      this.citas.sort((a, b) => {
        const fechaA = new Date(a.dia);
        const fechaB = new Date(b.dia);

        const [horaA, minA] = a.hora.split(':').map(Number);
        const [horaB, minB] = b.hora.split(':').map(Number);

        fechaA.setHours(horaA, minA, 0, 0);
        fechaB.setHours(horaB, minB, 0, 0);

        return fechaB.getTime() - fechaA.getTime(); // más reciente primero
      });

      console.log('Historial de citas pasadas y aceptadas:', this.citas);
    });
  }



  async ngOnInit() {
    this.cargarPreguntas();
    
    // Actualizar traducciones si el usuario cambia de idioma
    this.translate.onLangChange.subscribe(() => {
      this.cargarPreguntas();
    });
  }

  async showActionSheet(field: string) {
    const actionSheet = await this.alertController.create({
      header: this.translate.instant('EDIT_FIELD', { field }),
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.translate.instant('PLACEHOLDER_NAME'),
          value: this.usuarioActual.nombre
        }
      ],
      buttons: [
        {
          text: this.translate.instant('BUTTON_EDIT'),
          handler: (data: { name: string }) => {
            if (data.name) {
              this.usuarioActual.nombre = data.name;
              this.firestore.updateNombre(this.usuarioActual.nombre, this.usuarioActual.uid);
            }
          }
        },
        {
          text: this.translate.instant('BUTTON_CANCEL'),
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async showActionSheetMobile(field: string) {
    const actionSheet = await this.alertController.create({
      header: this.translate.instant('EDIT_FIELD', { field }),
      inputs: [
        {
          name: 'mobile',
          type: 'text',
          placeholder: this.translate.instant('PLACEHOLDER_MOBILE'),
          value: this.usuarioActual.movil
        }
      ],
      buttons: [
        {
          text: this.translate.instant('BUTTON_EDIT'),
          handler: (data: { mobile: string }) => {
            if (data.mobile) {
              this.usuarioActual.movil = data.mobile;
              this.firestore.updateMovil(this.usuarioActual.movil, this.usuarioActual.uid);
            }
          }
        },
        {
          text: this.translate.instant('BUTTON_CANCEL'),
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }


  volver(){
    this.navCtrl.back();
  }

  toggleRespuesta(pregunta: any) {
    pregunta.abierto = !pregunta.abierto;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duración en milisegundos (2 segundos)
      position: 'bottom', // Posición del Toast (puede ser 'top', 'bottom', 'middle')
      color: 'success'  // El color del Toast (puede ser 'success', 'danger', 'warning', etc.)
    });
    await toast.present();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.selectedTheme = savedTheme;
      this.applyTheme(savedTheme);
    }
  }

  // Cambiar el tema basado en la opción seleccionada
  onThemeChange(event: any) {
    const theme = event.detail.value;
    this.selectedTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('theme', theme); // Guardar la selección del tema
  }

  // Aplicar el tema al body de la aplicación
  applyTheme(theme: string) {
    document.body.classList.remove('dark', 'light');

    if (theme === 'oscuro') {
      document.body.classList.add('dark');
    } else if (theme === 'claro') {
      document.body.classList.add('light');
    }
    // Si no es claro ni oscuro, dejamos que el sistema decida (no se pone ninguna clase)
  }

  verImagen(foto: string) {
    this.imagenSeleccionada = foto;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  goToPago() {
    // Llévalo a la página de pago
    this.router.navigate(['/pago']);
  }

  async showActionSheetMovil(campo: string) {
    const actionSheet = await this.alertController.create({
      header: this.translate.instant('EDIT_FIELD'),
      inputs: [
        {
          name: 'movil',
          type: 'text',
          placeholder: this.translate.instant('PLACEHOLDER_MOBILE'),
          value: this.usuarioActual.movil
        }
      ],
      buttons: [
        {
          text: this.translate.instant('BUTTON_EDIT'),
        handler: (data: { movil: string; }) => {
          if (data.movil) {
            this.usuarioActual.movil = data.movil;
            this.firestore.updateMovil(this.usuarioActual.movil, this.usuarioActual.uid);
          }
          }
        },
        {
          text: this.translate.instant('BUTTON_CANCEL'),
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
  
}