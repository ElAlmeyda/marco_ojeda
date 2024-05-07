import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import { CitaService } from 'src/app/backend/cita.service';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Cita, Empleado, Urgencia } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-gestor-calendario',
  templateUrl: './gestor-calendario.page.html',
  styleUrls: ['./gestor-calendario.page.scss'],
})
export class GestorCalendarioPage implements OnInit {
  cita: Cita[]= [];
  urgencia: Urgencia[]= [];
  embarazo = '';
  tipoCita='Citas';

  urgencias=false;
  citaPrivada=false;
  filtroDentista: string[] = [];
  filtroServicio: string[] = [];
  filtroDia="";
  selectmode= 'date';
  showCalendar=false;
  today:any;


  public empleado: Empleado[] = [];

  citasFuturas$!: Observable<any[]>;

  constructor(public fireAuth: FirestoreAuthService, public firestore: FirestoreService, public citas: CitaService, public router: Router,
              public equipo: EquipoServiceService) { 
    
  }

  ngOnInit() {
    this.obtenerCitasFuturas();
    this.getEquipo()
  }

  getEquipo(){
    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getOdontologos();
    });
  }


  obtenerCitasFuturas(){
    this.citasFuturas$ = this.citas.getCitasFuturas();
    this.citas.getUrgencias().subscribe(res => {
      this.urgencia = res;
      this.embarazada();
      console.log(this.urgencia);
    });
  }

  citaOurgencia(event: any){
    this.tipoCita = event.detail.value;
  }

  aplicarFiltro() {
    this.citasFuturas$ = this.citas.getCitasFuturas().pipe(
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
        if(this.filtroDia == '') {
          citasFiltradas = citas;
        }
        return citasFiltradas; 
      })
    );
  }


  async obtenerCitas(){
    this.citas.getUsuariosCitas().subscribe((res: Cita[]) =>{
      this.cita = res.filter(cita => cita.estado === 'pendiente');
    });
  }

  aceptar(item: Cita){
    item.estado="aceptado";
    this.citas.actualizarCita(item);
  }

  eliminar(item: Cita){
    this.citas.eliminarCita(item);
  }

  editar(item: Cita){
    this.router.navigate(['/editar-calendario'], { state: {Cita: item}});
  }

  embarazada(){
    this.citas.getUrgencias().subscribe(res => {
        this.urgencia = res.map(urgencia =>{
        if(urgencia.embarazo){
          this.embarazo = "No";
        } else {
          this.embarazo = "Si";
        }
        return urgencia;
        })
    });
  }

  eliminarUrgencia(item: Urgencia){
    this.citas.eliminarUrgencia(item);
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

}
