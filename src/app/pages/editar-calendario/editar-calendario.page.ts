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

  public editarCita: any = [];

  public empleado: Empleado[] = [];


  userLogin= false;
  

  constructor(private user: UsuariosService, private datePipe: DatePipe, public auth: FirestoreAuthService, public firestore: FirestoreService, public equipo: EquipoServiceService,
    public cita: CitaService, private route: ActivatedRoute) {
     }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    await this.obtenerCitas();
    this.getEquipo();
    console.log(this.editarCita);
  }

  async obtenerCitas(){
    this.cita.getUsuariosCitas().subscribe((res: Cita[]) =>{
      this.editarCita = res.filter(res => res.id === this.id);
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
