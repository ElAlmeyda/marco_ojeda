import { Injectable } from '@angular/core';
import { EquipoModule } from '../module/equipo/equipo.module';
import { FirestoreService } from './firestore.service';
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
    this.equipoOdontologos = this.empleado.filter(empleado => empleado.tipo === 'Odontologos');
    return this.equipoOdontologos;
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

}
