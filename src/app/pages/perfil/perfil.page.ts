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

  historial: [] = [];

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
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  obtenerCita() {
    this.citas.getCitas().subscribe(res => {
      if (res != undefined) {
        this.citaPendiente = res.filter(cita => cita.estado === 'pendiente');;
        this.citaConfirmada = res.filter(cita => cita.estado === 'aceptado');;
        this.citaEditada = res.filter(cita => cita.estado === 'editada');;
      }
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

}
