import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import { CitaService } from 'src/app/backend/cita.service';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Cita, Empleado } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-dia',
  templateUrl: './dia.page.html',
  styleUrls: ['./dia.page.scss'],
})
export class DiaPage implements OnInit {
  cita: Cita[]= [];
  currentItem: any;

  citasFuturas$!: Observable<any[]>;
  filtroDentista: string[] = [];
  filtroServicio: string[] = [];
  filtroDia: string[] = [];
  public empleado: Empleado[] = [];
  retraso=0;


  constructor(public fireAuth: FirestoreAuthService, public firestore: FirestoreService, public citas: CitaService, public router: Router, public equipo: EquipoServiceService,
              public alertController: AlertController) { }
  
  ngOnInit() {
    this.obtenerCitasHoy();
    this.getEquipo();
  }

  getEquipo(){
    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getOdontologos();
    });
  }

  async retrasar(item: Cita){
    const alert = await this.alertController.create({
      header: 'Alerta Cita Aceptada',
      message: 'Cuantas citas quieres adelantar',
      buttons: [
        {
          text: 'Una Cita',
          handler: () => {
            let hora = parseInt(item.hora.substr(0, 2)); 
            let minutos = parseInt(item.hora.substr(3, 2)); 
            minutos += this.retraso;
            if (minutos >= 60) {
            const horasExtra = Math.floor(minutos / 60);
            hora += horasExtra;
            minutos = minutos % 60;
            }
            let nuevaHora = `${hora}:${minutos.toString().padStart(2, '0')}`;
            item.hora = nuevaHora;
            this.citas.actualizarCita(item);
          }
        }, {
          text: 'Todas las citas',
          handler: async () => {
            try {
              await this.citas.atrasarCitasDentista(item.dentista, this.retraso);
            } catch (error) {
              console.error("Error al crear el empleado:", error);
            }finally {
              await alert.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }
  
  async adelantar(item: Cita){
    const alert = await this.alertController.create({
      header: 'Alerta Cita Aceptada',
      message: 'Cuantas citas quieres adelantar',
      buttons: [
        {
          text: 'Una Cita',
          handler: () => {
            let hora = parseInt(item.hora.substr(0, 2)); 
            let minutos = parseInt(item.hora.substr(3, 2)); 
            if (minutos >= this.retraso) {
              minutos -= this.retraso;
            } else {
              minutos = 60 - (this.retraso - minutos);
              hora--;
            }
            let nuevaHora = `${hora}:${minutos.toString().padStart(2, '0')}`;
            item.hora = nuevaHora;

            this.citas.actualizarCita(item);
          }
        }, {
          text: 'Todas las citas',
          handler: async () => {
            try {
              await this.citas.adelantarCitasDentista(item.dentista, this.retraso);
            } catch (error) {
              console.error("Error al crear el empleado:", error);
            }finally {
              await alert.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }


  obtenerCitasHoy(){
    this.citasFuturas$ = this.citas.getCitasHoy();
  }

  aplicarFiltro() {
    this.citasFuturas$ = this.citas.getCitasHoy().pipe(
      map(citas => {
        let citasFiltradas = citas;

      // Filtrar por dentista si se especifica
      if (this.filtroDentista.length !== 0) {
        citasFiltradas = citasFiltradas.filter(cita => this.filtroDentista.includes(cita.dentista));
      }

      // Filtrar por servicio si se especifica
      if (this.filtroServicio.length !== 0) {
        citasFiltradas = citasFiltradas.filter(cita => this.filtroServicio.some(servicio => cita.servicio.includes(servicio)));
      }
        return citasFiltradas; 
      })
    );
  }
}
