import { Injectable } from '@angular/core';
import { EquipoModule } from '../module/equipo/equipo.module';
import { FirestoreService } from '../service/firestore.service';
import { Empleado } from '../model';
import { EmptyError, Observable, tap, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoServiceService {
  filter(empleado: EquipoServiceService, arg1: boolean): any {
    throw new Error('Method not implemented.');
  }

  

  constructor( public database: FirestoreService) { }

  private path = 'EquipoClinico/';
  empleado : Empleado[] = [];
  public equipoOdontologos: Empleado[] = [];
  public equipoAuxiliar: Empleado[] = [];
  public equipoHiguienista: Empleado[] = [];
  public equipoAtencionAlPaciente: Empleado[] = [];

  getEquipo() {
    return this.database.getCollection<Empleado>(this.path).pipe(
      tap((res: Empleado[]) => {
        this.empleado = res;
      })
    );
  }

  getOdontologos(){
    return this.equipoOdontologos = this.empleado.filter(empleado => empleado.tipo === 'Odontologos');
  }

  getHigienistas(){
    this.equipoHiguienista = this.empleado.filter(empleado => empleado.tipo === 'Higienistas');
    return this.equipoHiguienista;
  }
  
  getAuxiliares(){
    this.equipoAuxiliar = this.empleado.filter(empleado => empleado.tipo === 'Auxiliares');
    return this.equipoAuxiliar;
  }

  getAtencion(){
    this.equipoAtencionAlPaciente = this.empleado.filter(empleado => empleado.tipo === 'Atencion al paciente');
    return this.equipoAtencionAlPaciente;
  }


  getEspecialista(id: string){
    return this.empleado = this.empleado.filter(empleado => empleado.id === id);
  }

  getEmpleados(){
    return this.empleado;
  }

  crearEmpleado(nombre: string, descripcion: string, foto: string, tipo: string){
    const data = {nombre, descripcion, foto, tipo, id:''};
    data['id']= this.database.getId();
    return this.database.creatDoc(data, this.path, this.database.getId());
  }

  actualizarEmpleado(nombre: string, descripcion: string, foto: string, tipo: string, id: string){
    const data = {nombre, descripcion, foto, tipo, id}
    return this.database.updateDoc(data, this.path, id);
  }

  deleteEmpleado(){

  }

}
