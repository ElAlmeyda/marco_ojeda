import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  modal!: IonModal;
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

  actualizarCita!:Cita;

  public empleado: Empleado[] = [];


  userLogin= false;
  

  constructor(private user: UsuariosService, private datePipe: DatePipe, public auth: FirestoreAuthService, public firestore: FirestoreService, public equipo: EquipoServiceService,
    public cita: CitaService, private route: ActivatedRoute) {
     }

  async ngOnInit() {
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

  
  confirm() {
    this.fechaModificada = this.dia ? this.datePipe.transform(this.dia, 'dd-MM-yyyy') ?? '' : '';
    return this.modal.dismiss(null, 'cancel');
  }

  enviar(){
    if (this.editarCita) {
      this.actualizarCita = {
        nombre: this.editarCita.nombre,
        servicio: this.servicio,
        movil: this.editarCita.movil,
        dentista: this.especialista,
        dia: this.editarCita.nombre,
        hora: this.hora,
        estado: 'editada',
        id: this.id,
        uid: this.editarCita.uid
    };
  }
    console.log(this.actualizarCita);
    
    this.cita.actualizarCita(this.actualizarCita);
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
