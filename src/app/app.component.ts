import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsuariosService } from './backend/usuarios.service';
import { FirestoreAuthService } from './service/firestore-auth.service';
import { FirestoreService } from './service/firestore.service';
import { Cita, Usuario } from './model';
import { CarritoService } from './backend/carrito.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CitaService } from './backend/cita.service';
import { NotificacionService } from './service/notificacion.service';
import { Calendar } from '@ionic-native/calendar/ngx';
import { MenuController, Platform  } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';


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
    password: '',
    rol:''
  };
  userName="";
  uid = "";
  cita: Cita []= [];
  

  toggleList() {
    this.showList = !this.showList;
  }

  constructor(private user: UsuariosService, public auth: FirestoreAuthService, public firestore: FirestoreService, 
              public carritoService: CarritoService, public router: Router, public citas: CitaService, public notificacion: NotificacionService,
              private calendar: Calendar, private menuController: MenuController, private platform: Platform ) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        await this.obtenerUsuario();
        this.obtenerCita();
      } else {
        this.uid= '';
        this.user.changeUserLogin(false);
        this.change = this.user.usuarioLogin;
        this.usuario.rol='';
        this.router.navigate(['/folder']);

      }
    });
  }

  ngOnInit() {
    this.initMap();
    
  }

  closeMenu() {
    this.menuController.close();
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

  obtenerCita() {
    this.citas.getCitas().subscribe(res => {
      if (res != undefined) {
        this.cita = res.filter(res=> res.estado === 'aceptado');
      }
    });
  }


  logout(){
    this.auth.logout();
    this.user.changeUserLogin(false);
    this.change = this.user.usuarioLogin;
    this.usuario.rol='';
    this.carritoService.clearCarrito();
  }

  initMap() {
    const clinicaLocation = { lat: 28.101109878824143, lng: -15.470295511575157 };

    const mapOptions: google.maps.MapOptions = {
     center: clinicaLocation, 
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: clinicaLocation, 
      map: this.map, 
      title: 'Clínica', 
    });

    marker.addListener('click', () => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${clinicaLocation.lat},${clinicaLocation.lng}`);
    });
  }

  addToCalendar(cita: any) {
    if (this.platform.is('cordova')) {
      const diaCita = new Date(cita.dia);
      const horaCita = cita.hora.split(':');
      diaCita.setHours(Number(horaCita[0]), Number(horaCita[1]), 0, 0);
  
      // Datos del evento
      const eventDetails = {
        title: `Cita: ${cita.detalle}`,
        location: 'Consultorio de especialista',  // Ubicación
        notes: 'Detalles adicionales de la cita',  // Notas
        startDate: diaCita,  // Fecha de inicio
        endDate: new Date(diaCita.getTime() + 60 * 60 * 1000),  // Duración de una hora
        alarms: [{ method: 1, time: -30 }]  // Alarma 30 minutos antes
      };
  
      // Verifica si el calendario está accesible
      this.calendar.hasReadWritePermission().then((hasPermission) => {
        if (hasPermission) {
          // Si tiene permisos, crea el evento
          this.calendar.createEvent(
            eventDetails.title, 
            eventDetails.location, 
            eventDetails.notes, 
            eventDetails.startDate, 
            eventDetails.endDate
          ).then(() => {
            console.log('Evento agregado al calendario');
          }).catch((error) => {
            console.error('Error al agregar evento al calendario:', error);
          });
        } else {
          // Si no tiene permisos, pide permisos
          this.calendar.requestReadWritePermission().then(() => {
            this.calendar.createEvent(
              eventDetails.title, 
              eventDetails.location, 
              eventDetails.notes, 
              eventDetails.startDate, 
              eventDetails.endDate
            ).then(() => {
              console.log('Evento agregado al calendario');
            }).catch((error) => {
              console.error('Error al agregar evento al calendario:', error);
            });
          }).catch((error) => {
            console.error('Permiso denegado para acceder al calendario', error);
          });
        }
      }).catch((error) => {
        console.error('Error al verificar los permisos del calendario', error);
      });
    } else {
      console.log('Esta función solo está disponible en dispositivos móviles');
    }
  }
}
