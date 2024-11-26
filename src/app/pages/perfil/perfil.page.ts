import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CitaService } from 'src/app/backend/cita.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Cita, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import 'hammerjs';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  uid ='';
  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  };

  citaPendiente: Cita [] = [];
  citaConfirmada: Cita [] = [];
  citaEditada: Cita [] = [];

  historial: Cita[] = [];

  showList = false;


  tipoPerfil='Datos';


  constructor(public auth: FirestoreAuthService, public user: UsuariosService, public citas: CitaService, private alertController: AlertController) { 
    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        this.obtenerUsuario();
      } else {
        this.uid= '';
      }
    });
  }

  

  ngOnInit() {
     
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.usuario = usuario;
        this.obtenerCita();
        this.getHistorial();
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  obtenerCita() {
    this.citas.getCitas().subscribe(res => {
      if (res != undefined) {
        this.citaPendiente = res.filter(cita => cita.estado === 'pendiente').filter(cita => {
          const fechaCita = new Date(cita.dia);
          const ahora = new Date();
          
          // Comparamos si la cita está vencida
          if (fechaCita < ahora) {
            // Si la cita está vencida, no la incluimos en la lista de citas pendientes
            this.citas.eliminarCita(cita); // Eliminamos la cita directamente
            return false; // Filtramos la cita
          }
          return true; // Si la cita no está vencida, la mantenemos
        }).sort((a, b) => {
          // Ordenar por fecha y hora
          const fechaA = new Date(a.dia).getTime();
          const fechaB = new Date(b.dia).getTime();
  
          if (fechaA === fechaB) {
            // Si las fechas son iguales, comparar por hora
            return new Date(a.hora).getHours() - new Date(b.hora).getHours() ||
                   new Date(a.hora).getMinutes() - new Date(b.hora).getMinutes();
          }
          return fechaA - fechaB; // Si no son del mismo día, ordenar por fecha
        });
        this.citaConfirmada = res.filter(cita => cita.estado === 'aceptado').sort((a, b) => {
          // Comparar primero por fecha
          const fechaA = new Date(a.dia).getTime();
          const fechaB = new Date(b.dia).getTime();
          if (fechaA === fechaB) {
            // Si las fechas son iguales, comparar por hora
            return new Date(a.hora).getHours() - new Date(b.hora).getHours() ||
                   new Date(a.hora).getMinutes() - new Date(b.hora).getMinutes();
          }
          return fechaA - fechaB; // Si no son del mismo día, ordenar por fecha
        });
        this.citaEditada = res.filter(cita => cita.estado === 'editada').filter(cita => {
          const fechaCita = new Date(cita.dia);
          const ahora = new Date();
          
          // Comparamos si la cita está vencida
          if (fechaCita < ahora) {
            // Si la cita está vencida, no la incluimos en la lista de citas pendientes
            this.citas.eliminarCita(cita); // Eliminamos la cita directamente
            return false; // Filtramos la cita
          }
          return true; // Si la cita no está vencida, la mantenemos
        }).sort((a, b) => {
          // Ordenar por fecha y hora
          const fechaA = new Date(a.dia).getTime();
          const fechaB = new Date(b.dia).getTime();
  
          if (fechaA === fechaB) {
            // Si las fechas son iguales, comparar por hora
            return new Date(a.hora).getHours() - new Date(b.hora).getHours() ||
                   new Date(a.hora).getMinutes() - new Date(b.hora).getMinutes();
          }
          return fechaA - fechaB; // Si no son del mismo día, ordenar por fecha
        });
      }
    this.revisarCitasVencidas();
    });
  }

  aceptar(item: Cita){
    item.estado="aceptado";
    this.citas.actualizarCita(item);
  }

  async eliminar(item: Cita){
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.citas.eliminarCita(item);
          }
        }
      ]
    });
  
    await alert.present();
  }

  citaOurgencia(event: any){
    this.tipoPerfil = event.detail.value;
  }

  cambiarSegmento(direccion: string) {
    const segmentos = ['Datos', 'Pendientes', 'Aceptadas'];
    const indiceActual = segmentos.indexOf(this.tipoPerfil);
    
    if (direccion === 'derecha' && indiceActual < segmentos.length - 1) {
      this.tipoPerfil = segmentos[indiceActual + 1];
    } else if (direccion === 'izquierda' && indiceActual > 0) {
      this.tipoPerfil = segmentos[indiceActual - 1];
    }
  }

  toggleList() {
    this.showList = !this.showList;
  }

  revisarCitasVencidas() {
    const ahora = new Date();  // Hora actual
    
    // Iteramos sobre las citas confirmadas (aceptadas)
    this.citaConfirmada.forEach(cita => {
      const fechaCita = new Date(cita.dia);  // Fecha de la cita (día)
      const [hora, minutos] = cita.hora.split(':').map(Number);  // Hora y minutos de la cita
  
      // Establecer la hora y minutos en la fecha de la cita
      fechaCita.setHours(hora, minutos, 0, 0);  // Añadir hora y minutos a la fecha
      
      // Si la cita está vencida (ya ha pasado completamente), la movemos al historial
      if (fechaCita < ahora && cita.estado === 'aceptado') {
        this.moverAlHistorial(cita);  // Mover al historial
      }
    });
  }
  
  moverAlHistorial(cita: Cita) {
    this.citas.guardarHistorial(cita);
    this.citas.eliminarCita(cita);
  }

  getHistorial(){
    this.citas.getHistorial(this.uid).subscribe(res=> {
      this.historial = res;
    });
  }


  async anularCita(item: Cita){
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas anular la cita?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Anular',
          handler: () => {
            item.estado = "anulada";
            this.citas.actualizarCita(item);
          }
        }
      ]
    });
  
    await alert.present();
  }


}
