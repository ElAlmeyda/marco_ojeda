import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { FirestoreAuthService } from '../service/firestore-auth.service';
import { Cita } from '../model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private path="Cita/";
  public uid ='';

  public cita: Cita = {
    nombre: '',
    servicio: '',
    movil: '',
    dentista: '',
    dia: '',
    hora: '',
    estado: ''
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
    const data= {nombre, servicio, movil, dentista, dia, hora, uid, estado:'pendiente'};
    if(this.getCitas()){
      this.firestrore.addDoc(path, data);
    } else {
      this.firestrore.creatDoc(data, path, this.uid);
    }
  }

  eliminarCita(uid: string){
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    this.firestrore.deleteDoc(path, uid);
  }

  actualizarCita(){
    
  }


  getCitas() {
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    return this.firestrore.getCollection<Cita>(path);
  }

  getCita(){
    return this.cita;
  }
}
