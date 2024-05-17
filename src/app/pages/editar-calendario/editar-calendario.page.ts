import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { CitaService } from 'src/app/backend/cita.service';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Cita, Empleado, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-editar-calendario',
  templateUrl: './editar-calendario.page.html',
  styleUrls: ['./editar-calendario.page.scss'],
})
export class EditarCalendarioPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  modalAbierto = false;
  uid='';
  public id:any;


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

  editarCita: Cita = {
    nombre: '',
    servicio: '',
    movil: '',
    dentista: '',
    dia: '',
    hora: '',
    estado:'',
    id: '',
    uid:'',
  };

  selectmode= 'date';
  showCalendar=false;
  
  actualizarCita!:Cita;

  public empleado: Empleado[] = [];


  userLogin= false;
  

  constructor(private user: UsuariosService, private datePipe: DatePipe, public auth: FirestoreAuthService, public firestore: FirestoreService, public equipo: EquipoServiceService,
    public cita: CitaService, private route: ActivatedRoute) {
     }

  async ngOnInit() {
    this.modalAbierto = false;
    this.id = this.route.snapshot.paramMap.get('id');
    await this.obtenerCitas();
    this.getEquipo();
  }

  async obtenerCitas(){
    this.cita.getUsuariosCitas().subscribe((res: Cita[]) =>{
      const citasFiltradas = res.filter(cita => cita.id == this.id);
        if (citasFiltradas.length > 0) {
            this.editarCita = citasFiltradas[0]; // Tomar el primer elemento del array
        }
      console.log(this.editarCita);
    });
  }

  getEquipo(){
    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getOdontologos();
    });
  }

  initCita() {
    return this.editarCita = {
      nombre: '',
      servicio: '',
      movil: '',
      dentista: '',
      dia: '',
      hora: '',
      estado: '',
      id: '',
      uid: '',
    };
  }


  enviar(){
    if (this.editarCita) {
      this.actualizarCita = {
        nombre: this.editarCita.nombre,
        servicio: this.editarCita.servicio,
        movil: this.editarCita.movil,
        dentista: this.editarCita.dentista,
        dia: this.editarCita.dia,
        hora: this.editarCita.hora,
        estado: 'editada',
        id: this.id,
        uid: this.editarCita.uid
    };
  }
    this.cita.actualizarCita(this.actualizarCita);
    this.editarCita = this.initCita();
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); }


  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  }; 

  seleccionaDia(event:any){
    const fechaSeleccionada = event.detail.value;
    this.fechaModificada = fechaSeleccionada;
    this.editarCita.dia = this.fechaModificada;
    this.showCalendar = false;
  }

  
  abrirCalendario(){
    this.showCalendar = !this.showCalendar;
  }

  cancelarCalendario(){
    this.showCalendar = false;
    this.fechaModificada = this.editarCita.dia;
  }
}
