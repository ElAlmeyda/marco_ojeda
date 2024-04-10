import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitaService } from 'src/app/backend/cita.service';
import { Cita } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-gestor-calendario',
  templateUrl: './gestor-calendario.page.html',
  styleUrls: ['./gestor-calendario.page.scss'],
})
export class GestorCalendarioPage implements OnInit {
  cita: Cita[]= [];

  particular: Cita = {
    nombre: '',
    servicio: '',
    movil: '',
    dentista: '',
    dia: '',
    hora: '',
    estado: '',
    id:'',
    uid:''
}

  constructor(public fireAuth: FirestoreAuthService, public firestore: FirestoreService, public citas: CitaService, public router: Router) { 
  }

  ngOnInit() {
    this.obtenerCitas();
  }


  async obtenerCitas(){
    this.citas.getUsuariosCitas().subscribe((res: Cita[]) =>{
      this.cita = res.filter(cita => cita.estado === 'pendiente');;
    });
  }

  aceptar(item: Cita){
    this.citas.actualizarCita(item);
  }

  eliminar(item: Cita){
    this.citas.eliminarCita(item);
  }

  editar(item: Cita){
    this.router.navigate(['/editar-calendario'], { state: {Cita: item}});
  }
}
