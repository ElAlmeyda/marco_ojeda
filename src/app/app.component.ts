import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsuariosService } from './backend/usuarios.service';
import { FirestoreAuthService } from './service/firestore-auth.service';
import { FirestoreService } from './service/firestore.service';
import { Cita, Usuario } from './model';
import { CarritoService } from './backend/carrito.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CitaService } from './backend/cita.service';
import { NotificacionService } from './service/notificacion.service';
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
              ) {
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
}
