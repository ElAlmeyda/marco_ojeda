import { Component, OnInit } from '@angular/core';
import { CitaService } from 'src/app/backend/cita.service';
import { Cita, Urgencia } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-urgencia',
  templateUrl: './urgencia.page.html',
  styleUrls: ['./urgencia.page.scss'],
})
export class UrgenciaPage implements OnInit {

  cita: Urgencia[]= [];
  embarazo = '';

  constructor(public firestore: FirestoreService, public auth: FirestoreAuthService, public urgencias: CitaService) { }

  ngOnInit() {
    this.obtenerUgencias();
  }

  async obtenerUgencias(){
    this.urgencias.getUrgencias().subscribe(res => {
      this.cita = res;
      this.embarazada();
    });
  }

  aceptar(item: Urgencia){

  }

  embarazada(){
    this.urgencias.getUrgencias().subscribe(res => {
        this.cita = res.map(urgencia =>{
        if(urgencia.embarazo){
          this.embarazo = "No";
        } else {
          this.embarazo = "Si";
        }
        return urgencia;
        })
    });
  }
}
