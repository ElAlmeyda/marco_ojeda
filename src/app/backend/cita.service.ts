import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { FirestoreAuthService } from '../service/firestore-auth.service';
import { Cita, Urgencia } from '../model';
import { Observable, concatMap, forkJoin, from, map, mergeMap, take, tap } from 'rxjs';
import { idToken } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
  constructor(public firestrore: FirestoreService, public fireAuth: FirestoreAuthService, public storage: AngularFireStorage) { 
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
    const pathFoto ="gs://servicio-4f831.appspot.com/Urgencias/" + urgencia.foto;
    urgencia.foto = pathFoto;
    urgencia.id= this.firestrore.getId();
    this.firestrore.creatDoc(urgencia, path, urgencia.id);
  }

  public subirImagen(file: any){
    const nombre = file.name;
    const path = "gs://servicio-4f831.appspot.com/Urgencias/" + nombre;
    return this.firestrore.subirImagenes(file, path, nombre);
  }

  public getDownloadUrl(imagenRef: string) {
    const ref = this.storage.refFromURL(imagenRef);
    return ref.getDownloadURL();
  }

  eliminarUrgencia(urgencia: Urgencia){
    const path = '/Urgencias';
    this.firestrore.deleteDoc(path, urgencia.id);
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
        const ahora = new Date();
  
        // Filtra las citas del día de hoy
        const citasHoy = citas.filter(cita => {
          const fechaCita = cita.dia.split('T')[0]; // Extrae solo la parte de la fecha de la cita
          const horaCita = cita.hora.split(':'); // Divide la hora de la cita en horas y minutos
          const horaCitaDate = new Date(); // Crea un nuevo objeto Date para la hora de la cita
          horaCitaDate.setHours(Number(horaCita[0]), Number(horaCita[1]), 0, 0);

          return fechaCita === hoy && cita.estado=='aceptado';
        });
        citasHoy.sort((a, b) => {
          const horaA = a.hora.split(':');
          const horaB = b.hora.split(':');
          const horaDateA = new Date();
          horaDateA.setHours(Number(horaA[0]), Number(horaA[1]), 0, 0);
          const horaDateB = new Date();
          horaDateB.setHours(Number(horaB[0]), Number(horaB[1]), 0, 0);
          return horaDateA.getTime() - horaDateB.getTime();
        });
  
        return citasHoy;
      })
    );
  }

  getCitasAceptadas(){
    return this.getCitas().pipe(
      map(citas => {
        const citasAceptadas = citas.filter(cita => {
          return cita.estado=='aceptado';
        });
        return citasAceptadas;
      })
      );
    }

  async atrasarCitasDentista(nombreDentista: string, retraso: number) {
    try {
      this.getCitasHoy().pipe(
          take(1) // Completa la suscripción después de recibir una emisión
      ).subscribe(res => {
          const citasFiltradas = res.filter(cita => cita.dentista === nombreDentista);
          citasFiltradas.forEach(cita => {
              let hora = parseInt(cita.hora.substr(0, 2));
              let minutos = parseInt(cita.hora.substr(3, 2));
              minutos += retraso;
              if (minutos >= 60) {
                  const horasExtra = Math.floor(minutos / 60);
                  hora += horasExtra;
                  minutos = minutos % 60;
              }
              let nuevaHora = `${hora}:${minutos.toString().padStart(2, '0')}`;
              cita.hora = nuevaHora;
              this.actualizarCita(cita);
          });
      });
      } catch (error) {
        console.error('Error al atrasar las citas del dentista:', error);
    }
  }

  adelantarCitasDentista(nombreDentista: string, retraso: number) {
    try {
      this.getCitasHoy().pipe(
          take(1) // Completa la suscripción después de recibir una emisión
      ).subscribe(res => {
          const citasFiltradas = res.filter(cita => cita.dentista === nombreDentista);
          citasFiltradas.forEach(cita => {
            let hora = parseInt(cita.hora.substr(0, 2)); 
            let minutos = parseInt(cita.hora.substr(3, 2)); 
            if (minutos >= retraso) {
              minutos -= retraso;
            } else {
              minutos = 60 - (retraso - minutos);
              hora--;
            }
            let nuevaHora = `${hora}:${minutos.toString().padStart(2, '0')}`;
            cita.hora = nuevaHora;
            this.actualizarCita(cita);
          });
      });
      } catch (error) {
        console.error('Error al atrasar las citas del dentista:', error);
    }
  }
}
