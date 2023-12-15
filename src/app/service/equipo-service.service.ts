import { Injectable } from '@angular/core';
import { EquipoModule } from '../module/equipo/equipo.module';

@Injectable({
  providedIn: 'root'
})
export class EquipoServiceService {

  

  constructor() { }

  public equipoAtencionAlPaciente = [
    {
      id: 0,
      nombre: 'Pino Yañez',
      descripcion: 'Att. al paciente, control de calidad y gestión de proveedores',
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg']
    },
    {
      id: 1,
      nombre: 'Rosi',
      descripcion: 'Recepción y atención al paciente en Odontopediatría',
      imagen: ['../../assets/icon/o_1glabiu2f1ahd13i31lkb3vb1g8ka.jpg']
    },
    {
      id: 2,
      nombre: 'Amada',
      descripcion: 'Gerente, recursos humanos',
      imagen: ['../../assets/icon/o_1glaausvk1dmt10pv13lmsva18iva.jpg']
    },
    {
      id: 3,
      nombre: 'Yeray',
      descripcion: 'Recepcion y admistracion',
      imagen: ['../../assets/icon/o_1glaaenhd4m37rh1dppap8166la.jpg']
    }
  ];

  public equipoOdontologos = [
    {
      id: 0,
      nombre: 'Juan',
      descripcion: 'Att. al paciente, control de calidad y gestión de proveedores',
      imagen: ""
    },
    {
      id: 1,
      nombre: 'Pepe',
      descripcion: 'Recepción y atención al paciente en Odontopediatría',
      imagen: ""
    },
    {
      id: 2,
      nombre: 'Julio',
      descripcion: 'Gerente, recursos humanos',
      imagen: ""
    },
    {
      id: 3,
      nombre: 'Roberto',
      descripcion: 'Recepcion y admistracion',
      imagen: ""
    }
  ];

  obtenerAtencionAlPaciente() {
    return this.equipoAtencionAlPaciente;
  }

  obtenerOdontologo() {
    return this.equipoOdontologos;
  }


  encontrarEspecialista(ruta:any, id: any){
    const idBuscado = parseInt(ruta, 10);
    let producto;
    if(ruta == id){
      producto = this.equipoAtencionAlPaciente.find(equipoAtencionAlPaciente => equipoAtencionAlPaciente.id === idBuscado);
      return producto ? [producto] : [];
    }

    return producto ? [producto] : [];
  }
}
