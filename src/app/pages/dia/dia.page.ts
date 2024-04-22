import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CitaService } from 'src/app/backend/cita.service';
import { Cita } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-dia',
  templateUrl: './dia.page.html',
  styleUrls: ['./dia.page.scss'],
})
export class DiaPage implements OnInit {
  cita: Cita[]= [];

  citasFuturas$!: Observable<any[]>;

  constructor(public fireAuth: FirestoreAuthService, public firestore: FirestoreService, public citas: CitaService, public router: Router) { }
  
  ngOnInit() {
    this.obtenerCitasHoy();
  }

  retrasar(item: Cita){

  }
  
  adelantar(item: Cita){

  }

  ordenarLista(event: any) {
    const criterio = event.detail.value;
    switch (criterio) {
      case 'Fecha':
        this.citasFuturas$ = this.citasFuturas$.pipe(
          map(citas => {
            return citas.sort((a, b) => {
              const fechaA = new Date(a.dia);
              const fechaB = new Date(b.dia);
              if (fechaA.getTime() === fechaB.getTime()) {
                // Si las fechas son iguales, compara por hora
                const horaA = parseInt(a.hora.split(':')[0]);
                const minutoA = parseInt(a.hora.split(':')[1]);
                const horaB = parseInt(b.hora.split(':')[0]);
                const minutoB = parseInt(b.hora.split(':')[1]);
                return horaA !== horaB ? horaA - horaB : minutoA - minutoB;
              }
              return fechaA.getTime() - fechaB.getTime();
            });
          })
        );
        break;
        case 'Dentista':
        this.citasFuturas$ = this.citasFuturas$.pipe(
          map(citas => {
            return citas.sort((a, b) => {
              const dentistaComparison = a.dentista.localeCompare(b.dentista);
              if (dentistaComparison === 0 && a.dia === b.dia) {
                // Si el dentista y la fecha son iguales, compara por hora
                const horaA = parseInt(a.hora.split(':')[0]);
                const minutoA = parseInt(a.hora.split(':')[1]);
                const horaB = parseInt(b.hora.split(':')[0]);
                const minutoB = parseInt(b.hora.split(':')[1]);
                return horaA !== horaB ? horaA - horaB : minutoA - minutoB;
              }
              return dentistaComparison;
            });
          })
        );
        break;
    }
  }

  obtenerCitasHoy(){
    this.citasFuturas$ = this.citas.getCitasHoy();
  }
}
