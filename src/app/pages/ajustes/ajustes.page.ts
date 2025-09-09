import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonModal, NavController, ToastController } from '@ionic/angular';
import { Cita, Resena, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { App } from '@capacitor/app';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { TiendaService } from 'src/app/backend/tienda.service';

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
    {
      titulo: '¿Cómo puedo crear una cuenta?',
      respuesta: 'Para crear una cuenta, ve a la sección de registro, ingresa tu correo electrónico, crea una contraseña segura y completa tu perfil como cliente o tatuador.',
      abierto: false,
    },
    {
      titulo: '¿Cómo agendo una cita con un tatuador?',
      respuesta: 'Puedes agendar una cita desde el perfil del tatuador. Selecciona la fecha, hora y el servicio que deseas. Luego confirma la cita y recibirás una notificación.',
      abierto: false,
    },
    {
      titulo: '¿Puedo cancelar o reprogramar una cita?',
      respuesta: 'Sí, puedes cancelar o reprogramar tu cita desde la sección "Mis citas". Te recomendamos hacerlo con al menos 24 horas de anticipación para evitar cargos.',
      abierto: false,
    },
    {
      titulo: '¿Cómo funcionan las reseñas y valoraciones?',
      respuesta: 'Después de tu cita, puedes dejar una reseña y calificar al tatuador según tu experiencia. Esto ayuda a otros usuarios a tomar decisiones informadas.',
      abierto: false,
    },
    {
      titulo: '¿Cómo encuentro tatuadores cerca de mí?',
      respuesta: 'Utiliza el buscador y activa la ubicación para ver tatuadores cercanos. Puedes filtrar por estilo, precio, valoraciones y disponibilidad.',
      abierto: false,
    },
    {
      titulo: '¿Puedo comunicarme con el tatuador antes de la cita?',
      respuesta: 'Sí, puedes enviar mensajes al tatuador desde su perfil o desde los detalles de tu cita una vez confirmada.',
      abierto: false,
    },
    {
      titulo: '¿Cómo reporto un problema con un tatuador o una cita?',
      respuesta: 'Si tuviste una mala experiencia o hubo un problema, puedes reportarlo desde el perfil del tatuador.',
      abierto: false,
    },
    {
      titulo: '¿Qué hago si un tatuador no se presenta a la cita?',
      respuesta: 'Lamentamos la situación. Por favor, repórtalo desde la sección de soporte para que podamos ayudarte a resolver el caso y aplicar las políticas correspondientes.',
      abierto: false,
    },
    {
      titulo: '¿Puedo guardar mis tatuadores favoritos?',
      respuesta: 'Sí, puedes marcar como favoritos los perfiles de tatuadores que te interesen para acceder fácilmente a ellos después.',
      abierto: false,
    },
    {
      titulo: '¿Cómo puedo registrarme como tatuador?',
      respuesta: 'Desde la pantalla de registro, a traves de nuestra otra aplicación. Completa tu perfil profesional, añade fotos de tu trabajo, servicios, precios y disponibilidad.',
      abierto: false,
    },
    {
      titulo: '¿Qué medidas de seguridad tienen para proteger mis datos?',
      respuesta: 'Tu información está protegida mediante protocolos de encriptación y seguridad. No compartimos tus datos personales sin tu consentimiento.',
      abierto: false,
    },
    {
      titulo: '¿Cómo puedo editar mi perfil?',
      respuesta: 'Puedes modificar tu información personal y más desde la sección "Perfil" en la aplicación.',
      abierto: false,
    },
    {
      titulo: '¿Puedo recibir recordatorios de mis citas?',
      respuesta: 'Sí, te enviaremos recordatorios por notificación push antes de tu cita para que no la olvides.',
      abierto: false,
    },
    {
      titulo: '¿Qué estilos de tatuajes puedo encontrar?',
      respuesta: 'Puedes buscar tatuadores por estilos como realismo, tradicional, minimalista, blackwork, entre otros, usando los filtros de búsqueda.',
      abierto: false,
    },
    {
      titulo: '¿Puedo subir referencias o ideas para mi tatuaje?',
      respuesta: 'Sí, puedes subir imágenes de referencia al momento de agendar tu cita o enviarlas directamente al tatuador mediante el chat.',
      abierto: false,
    },
    {
      titulo: '¿Cómo puedo eliminar mi cuenta?',
      respuesta: 'Puedes eliminar tu cuenta desde la sección de configuración. Ten en cuenta que esta acción es irreversible y se perderán todos tus datos.',
      abierto: false,
    },
    {
      titulo: '¿Puedo agendar varias citas al mismo tiempo?',
      respuesta: 'Sí, puedes reservar varias citas con el mismo tatuador o con diferentes tatuadores, según tu disponibilidad y necesidades.',
      abierto: false,
    },
    {
      titulo: '¿Qué hago si olvidé mi contraseña?',
      respuesta: 'En la pantalla de Cuenta dentro de tu perfil o a traves de cuando inicies sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones para restablecerla.',
      abierto: false,
    },
  ];
  isPago: any;
  isPremium: any;


  constructor(public firestore: FirestoreService, public user: UsuariosService, private navCtrl: NavController, public auth: FirestoreAuthService, public tiendaService: TiendaService,
              private route: ActivatedRoute, public alertController: AlertController, private actionSheetController: ActionSheetController, private toastController: ToastController,
              private router: Router
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
    this.presentToast("Reseña Actualizada");
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
      header: 'Eliminar Reseña',
      message: '¿Estás seguro de que quieres eliminar esta reseña?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.tiendaService
              .eliminarResena(this.usuarioActual.uid, resena.uidTatuador, resena.id)
              .then(() => {
                console.log('Reseña eliminada');
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
      
      // Filtrar solo citas aceptadas y que ya hayan pasado
      const ahora = new Date();

      this.citas = citas.filter(cita => {
        const fechaCita = new Date(cita.fecha); // si tienes fecha + hora, ajusta: new Date(cita.fecha + ' ' + cita.hora)
        return cita.estado === 'aceptada' && fechaCita < ahora;
      });

      console.log('Historial de citas pasadas y aceptadas:', this.citas);
    });
  }


  async ngOnInit() {
  }

  async showActionSheet(campo: string) {
    const actionSheet = await this.alertController.create({
      header: `Editar ${campo}`,
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Ingrese el nuevo nombre',
          value: this.usuarioActual.nombre
        }
      ],
      buttons: [
        {
          text: 'Editar',
        handler: (data: { nombre: string; }) => {
          if (data.nombre) {
            this.usuarioActual.nombre = data.nombre;
            this.firestore.updateNombre(this.usuarioActual.nombre, this.usuarioActual.uid);
          }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async showActionSheetMovil(campo: string) {
    const actionSheet = await this.alertController.create({
      header: `Editar ${campo}`,
      inputs: [
        {
          name: 'movil',
          type: 'text',
          placeholder: 'Ingrese el nuevo movil',
          value: this.usuarioActual.movil
        }
      ],
      buttons: [
        {
          text: 'Editar',
        handler: (data: { movil: string; }) => {
          if (data.movil) {
            this.usuarioActual.movil = data.movil;
            this.firestore.updateMovil(this.usuarioActual.movil, this.usuarioActual.uid);
          }
          }
        },
        {
          text: 'Cancelar',
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

}