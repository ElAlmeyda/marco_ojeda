import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CitaService } from 'src/app/backend/cita.service';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Empleado, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';


@Component({
  selector: 'app-pide-cita',
  templateUrl: './pide-cita.page.html',
  styleUrls: ['./pide-cita.page.scss'],
})
export class PideCitaPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  uid='';

  dia: Date | null = null;
  especialista='';
  hora='';
  servicio='';
  fechaModificada = '';
  today:any;

  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  };

  public empleado: Empleado[] = [];


  userLogin= false;
  
  constructor(private user: UsuariosService, private datePipe: DatePipe, public auth: FirestoreAuthService, public firestore: FirestoreService, public equipo: EquipoServiceService,
              public cita: CitaService) {

    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        const usuario = this.user.getUsuario();
        this.obtenerUsuario();
      } else {
        this.uid= '';
      }
    });
   }

  ngOnInit() {
    this.getDate();
    this.getEquipo();
  }

  getEquipo(){
    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getOdontologos();
    });
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.usuario = usuario;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  confirm() {
    this.fechaModificada = this.dia ? this.datePipe.transform(this.dia, 'dd-MM-yyyy') ?? '' : '';
    return this.modal.dismiss(null, 'cancel');
  }

  enviar(){
    this.cita.guardarCita(this.usuario.nombre, this.servicio, this.usuario.movil, this.especialista, this.fechaModificada, this.hora, this.uid);
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); }


  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  }; 
  
  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }
}

