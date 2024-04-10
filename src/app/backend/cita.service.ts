import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { FirestoreAuthService } from '../service/firestore-auth.service';
import { Cita } from '../model';
import { tap } from 'rxjs';
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


  guardarCita(nombre: string, servicio: string, movil: string, dentista: string, dia:string, hora: string, uid:string){
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
    item.estado = 'aceptado';
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

  getCitaConcreta(id: string){
    return this.citaCollection = this.citaCollection.filter(cita => this.cita.id === id);
  }
}
