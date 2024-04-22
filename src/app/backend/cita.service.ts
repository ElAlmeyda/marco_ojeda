import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { FirestoreAuthService } from '../service/firestore-auth.service';
import { Cita, Urgencia } from '../model';
import { Observable, map, tap } from 'rxjs';
import { idToken } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private path="Cita/";
  public uid ='';
  public citaCollection: Cita []= [];
  public cita: Cita = {
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
  constructor(public firestrore: FirestoreService, public fireAuth: FirestoreAuthService) { 
    this.fireAuth.stateAuth().subscribe(res => {
      if(res != null){
        this.uid = res.uid;
        this.getCitas();
      } 
    });
  }


  guardarCita(nombre: string, servicio: string, movil: string, dentista: string, dia:Date, hora: string, uid:string){
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    const data= {nombre, servicio, movil, dentista, dia, hora, uid, estado:'pendiente', id:''};
    data['id']= this.firestrore.getId();
    console.log(data);
    if(this.getCitas()){
      this.firestrore.addDoc(path, data, data['id']);
    } else {
      this.firestrore.creatDoc(data, path, data['id']);
    }
  }

  eliminarCita(item: Cita){
    const path = '/Usuarios/' + item.uid + '/' + this.path;
    this.firestrore.deleteDoc(path, item.id);
  }

  actualizarCita(item: Cita){
    const path = '/Usuarios/' + item.uid + '/' + this.path;
    this.firestrore.updateDoc(item, path, item.id);
  }


  getCitas() {
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    return this.firestrore.getCollection<Cita>(path);
  }

  getCita(){
    return this.cita;
  }

  getUsuariosCitas(){
    return this.firestrore.getUserCitas().pipe(
      tap((res: Cita[]) => {
        this.citaCollection = res;
      })
    );
  }

  getUserCitaCollection(){
    return this.citaCollection;
  }

  guardarUrgencia(urgencia: Urgencia){
    const path = '/Urgencias';
    urgencia.id= this.firestrore.getId();
    this.firestrore.creatDoc(urgencia, path, urgencia.id);
  }

  getUrgencias() {    
    const path = '/Urgencias';
    return this.firestrore.getCollection<Urgencia>(path);
  }


  // Método para obtener citas futuras
  getCitasFuturas(): Observable<Cita[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return this.getUsuariosCitas().pipe(
      map(citas => {
        const citasFuturas = citas.filter(cita => {
          const fechaCita = new Date(cita.dia);
          fechaCita.setHours(0, 0, 0, 0);
          return fechaCita.getTime() >= hoy.getTime();
        });
  
        // Ordenar citas por fecha
        return citasFuturas.sort((a, b) => {
          const fechaA = new Date(a.dia);
          const fechaB = new Date(b.dia);
          return fechaA.getTime() - fechaB.getTime();
        });
      }),
      map(citas => citas.filter(cita => cita.estado === 'pendiente')) // Filtrar citas pendientes
    );
  }

  getCitasHoy(){
    return this.getCitas().pipe(
      map(citas => {
        // Obtiene la fecha de hoy en formato de cadena de texto YYYY-MM-DD
        const hoy = new Date().toISOString().split('T')[0]; // Extrae solo la parte de la fecha
  
        // Filtra las citas del día de hoy
        const citasHoy = citas.filter(cita => {
          const fechaCita = cita.dia.split('T')[0]; // Extrae solo la parte de la fecha de la cita
          return fechaCita === hoy;
        });
  
        console.log(citasHoy);
        return citasHoy;
      })
    );
  }
}
