import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { TiendaService } from 'src/app/backend/tienda.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Cita, Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-pedir-cita',
  templateUrl: './pedir-cita.page.html',
  styleUrls: ['./pedir-cita.page.scss'],
})
export class PedirCitaPage implements OnInit {

  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };
  
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
  uid=''
  cita!: Cita;
  horaSeleccionada: string = '';

  diasResumen: string = '';
  acepto= false;
  primerPaso=true;
  segundoPaso=false;
  tercerPaso=false;
  fechaMin='';
  fechaSeleccionada: string = '';
  fechasDisponibles: string[] = [];
  horasLibres: string[] = [];
  tatuadorSeleccionado= '';
  mensaje='';
  tipo='';
  estilo='';

  constructor(public auth: FirestoreAuthService, public user: UsuariosService, private route: ActivatedRoute, public tiendaTatuador: TiendaService, public toast: ToastController,
      private router: Router, public navCtrl: NavController, public firestore: FirestoreService) {
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        
        console.log(this.fechaMin);
        this.usuario.uid = res.uid;
        this.obtenerUsuario();
        
      } else {
        this.usuario.uid= '';
      }
    });
   }

 ngOnInit() {
  const hoy = new Date();
  this.fechaMin = hoy.toISOString().split('T')[0];
  this.fechaSeleccionada = this.fechaMin;       
  this.uid = this.route.snapshot.paramMap.get('uid') || '';
  this.fechasDisponibles = [this.fechaMin];
  this.obtenerTatuador();
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
    this.tiendaTatuador.getTatuadorById(this.uid).subscribe(data => {
      if (data) {
        this.tatuador = data;
        console.log(this.tatuador);
         this.tiendaTatuador.getAvataresDeTatuador(this.uid).subscribe(avatares => {
          if(avatares)
          this.tatuador.avatar = avatares; // un array sólo con URLs válidas
        });
        if (this.tatuador.fecha) {
          this.fechasDisponibles = this.generarFechasDesdeDiasSemana(this.tatuador.fecha, 60);
        }
      } else {
        console.warn('No se encontró el tatuador');
      }
    });
  }

  generarFechasDesdeDiasSemana(diasSemana: string[], diasAdelante: number): string[] {
    const diasSemanaArray = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const diasTrabaja = diasSemana.map(d => d.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    const hoy = new Date();
    const fechas: string[] = [];

    for (let i = 0; i <= diasAdelante; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      const nombreDia = diasSemanaArray[fecha.getDay()];
      if (diasTrabaja.includes(nombreDia)) {
        fechas.push(fecha.toISOString().split("T")[0]);
      }
    }

    return fechas;
  }

  // Función para ion-datetime → habilitar solo las fechas en el array
  habilitarFecha = (fechaIsoString: string) => {
    const fecha = fechaIsoString.split("T")[0];
    return this.fechasDisponibles.includes(fecha);
  };


  guardarCita(){
    console.log(this.acepto);
    if (!this.cita) this.cita = {} as Cita;

    if(!this.acepto){
      this.presentToast("Debes aceptar las condiciones", "danger");
    } else {
      if(this.usuario.movil && this.horaSeleccionada && this.estilo && this.mensaje && this.tipo){
      // Rellenar la cita
      this.cita.correo = this.usuario.correo;
      this.cita.nombreUser = this.usuario.nombre;
      this.cita.movil = this.usuario.movil;
      this.cita.dia = this.fechaSeleccionada;
      this.cita.hora = this.horaSeleccionada;
      this.cita.nombreTatuador = this.tatuadorSeleccionado;
      this.cita.estilo = this.estilo;
      this.cita.mensaje = this.mensaje;
      this.cita.tipo = this.tipo;
    }

    this.tiendaTatuador.guardarCita(this.cita, this.usuario.uid, this.tatuador.uid)
      .then(() => {
        // Mostrar toast
        this.presentToast("La cita ha sido realizada, espera a que el tatuador conteste.", "success");

        // Resetear campos
        this.cita = {} as Cita;
        this.horaSeleccionada = '';
        this.estilo = '';
        this.mensaje = '';
        this.tipo = '';
        this.tatuadorSeleccionado = '';
        this.fechaSeleccionada = this.fechaMin;

        // Redirigir a la pestaña de citas
        this.router.navigate(['/tabs/cita']);
      })
      .catch(err => {
        console.error(err);
        this.presentToast("Error al guardar la cita.", "danger");
      });
    }
  }

  siguiente(){
    this.primerPaso = false;
    this.segundoPaso =true;
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

  volver(){
    if(this.primerPaso){
      this.navCtrl.navigateForward(['/tatuador', this.tatuador.uid]);
    } else {
      this.primerPaso = true;
      this.segundoPaso = false;
    }
  }

 obtenerHoraDisponibles() {
  this.firestore
    .getHorasDisponibles(this.tatuador.uid, this.fechaSeleccionada, this.tatuadorSeleccionado, this.tatuador.hora ?? [])
    .subscribe(horas => {
      const hoy = new Date();
      const fechaSeleccionada = new Date(this.fechaSeleccionada);

      // Si la fecha seleccionada es hoy, filtramos horas pasadas
      if (
        fechaSeleccionada.getFullYear() === hoy.getFullYear() &&
        fechaSeleccionada.getMonth() === hoy.getMonth() &&
        fechaSeleccionada.getDate() === hoy.getDate()
      ) {
        this.horasLibres = horas.filter(hora => {
          const [h, m] = hora.split(':').map(Number);
          return h > hoy.getHours() || (h === hoy.getHours() && m > hoy.getMinutes());
        });
      } else {
        this.horasLibres = horas;
      }
    });
  }
  
}
