import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, map, tap } from 'rxjs';
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
  citaVencidas: Cita[]= [];
  currentItem: any;

  citasFuturas$!: Observable<any[]>;
  filtroDentista: string[] = [];
  filtroServicio: string[] = [];
  filtroDia= '';
  selectmode= 'date';
  showCalendar=false;
  today:any;
  public empleado: Empleado[] = [];
  retraso=0;


  constructor(public fireAuth: FirestoreAuthService, public firestore: FirestoreService, public citas: CitaService, public router: Router, public equipo: EquipoServiceService,
              public alertController: AlertController) { }
  
  ngOnInit() {
    this.obtenerCitasHoy();
    this.getEquipo();
    setInterval(() => {
      this.getCitasVencida();
    }, 15 * 60 * 1000); 
  }

  getEquipo(){
    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getOdontologos();
    });
  }

  getCitasVencida() {
    this.citas.getCitasHoy().subscribe(citas => {
      console.log(citas);
        const ahora = new Date();
        this.citaVencidas = citas.filter(cita => {
          const horaCita = cita.hora.split(':'); 
          const horaCitaDate = new Date(); 
          horaCitaDate.setHours(Number(horaCita[0]), Number(horaCita[1]), 0, 0);
          const vencida = horaCitaDate < ahora;
          if (vencida) {
            this.citas.eliminarCita(cita); 
          }
          return vencida;
        })
        
      });
  }

  async retrasar(item: Cita) {
    const alert = await this.alertController.create({
        header: 'Alerta Cita Aceptada',
        message: 'Cuántas citas quieres retrasar',
        buttons: [
            {
                text: 'Una Cita',
                handler: () => {
                    // Verifica si this.retraso es un número válido
                    const retraso = isNaN(this.retraso) ? 0 : this.retraso;
                    // Validar el formato de item.hora
                    if (!item.hora || item.hora.length !== 5 || item.hora.indexOf(':') !== 2) {
                        console.error("Formato de hora inválido en item.hora");
                        return;
                    }
                    let hora = parseInt(item.hora.substr(0, 2));
                    let minutos = parseInt(item.hora.substr(3, 2));
                    // Validar si hora y minutos son números
                    if (isNaN(hora) || isNaN(minutos)) {
                        console.error("Hora o minutos inválidos en item.hora");
                        return;
                    }
                    // Retrasar los minutos
                    minutos += retraso;
                    const horasExtra = Math.floor(minutos / 60);
                    minutos = minutos % 60;
                    hora = (hora + horasExtra) % 24;
                    let nuevaHora = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
                    item.hora = nuevaHora;
                    // Actualizar la cita
                    this.citas.actualizarCita(item);
                }
            },
            {
                text: 'Todas las citas',
                handler: async () => {
                    try {
                        await this.citas.atrasarCitasDentista(item.dentista, this.retraso);
                    } catch (error) {
                        console.error("Error al retrasar las citas:", error);
                    } finally {
                        await alert.dismiss();
                    }
                }
            }
        ]
    });
    await alert.present();
  }
  
  async adelantar(item: Cita) {
    const alert = await this.alertController.create({
        header: 'Alerta Cita Aceptada',
        message: '¿Cuántas citas quieres adelantar?',
        buttons: [
            {
                text: 'Una Cita',
                handler: () => {
                    // Verifica si this.retraso es un número válido
                    const retraso = isNaN(this.retraso) ? 0 : this.retraso;
                    // Validar el formato de item.hora
                    if (!item.hora || item.hora.length !== 5 || item.hora.indexOf(':') !== 2) {
                        console.error("Formato de hora inválido en item.hora");
                        return;
                    }
                    let hora = parseInt(item.hora.substr(0, 2));
                    let minutos = parseInt(item.hora.substr(3, 2));
                    // Validar si hora y minutos son números
                    if (isNaN(hora) || isNaN(minutos)) {
                        console.error("Hora o minutos inválidos en item.hora");
                        return;
                    }
                    // Adelantar los minutos
                    minutos -= retraso;
                    while (minutos < 0) {
                        minutos += 60;
                        hora--;
                    }
                    if (hora < 0) {
                        hora = (hora + 24) % 24;
                    }
                    let nuevaHora = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
                    item.hora = nuevaHora;
                    // Actualizar la cita
                    this.citas.actualizarCita(item);
                }
            },
            {
                text: 'Todas las citas',
                handler: async () => {
                    try {
                        await this.citas.adelantarCitasDentista(item.dentista, this.retraso);
                    } catch (error) {
                        console.error("Error al adelantar las citas:", error);
                    } finally {
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
    console.log("Citas: ", this.citasFuturas$);
    this.citasFuturas$.subscribe(
      citas => {
        console.log("Dentro: ", citas);
      },
      error => {
        console.error('Error al obtener citas:', error);
      }
    );
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

      if (this.filtroDia.length !== 0) {
        const filtroDiaParteFecha = this.filtroDia.substring(0, 10); 
        citasFiltradas = citasFiltradas.filter(cita => {
          const citaParteFecha = cita.dia.substring(0, 10); 
          return citaParteFecha === filtroDiaParteFecha;
        });
      }
        return citasFiltradas; 
      })
    );
  }


  seleccionaDia(event:any){
    const fechaSeleccionada = event.detail.value;
    this.filtroDia = fechaSeleccionada;
    this.showCalendar = false;
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); }
  
  abrirCalendario(){
    this.showCalendar = !this.showCalendar;
  }

  cancelarCalendario(){
    this.showCalendar = false;
    this.filtroDia = '';
    this.aplicarFiltro();
  }


  limpiarFiltro(){
    this.filtroDentista = [];
    this.filtroServicio = [];
    this.aplicarFiltro();
  }

  
}
