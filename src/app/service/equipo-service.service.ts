import { Injectable } from '@angular/core';
import { EquipoModule } from '../module/equipo/equipo.module';

@Injectable({
  providedIn: 'root'
})
export class EquipoServiceService {

  

  constructor() { }
  public tipoEspecialista = [
    {
      id: 0,
      especialista: 'Atencion al Cliente',
    },
    {
      id: 1,
      especialista: 'Auxiliar',
    },
    {
      id: 2,
      especialista: 'Odontologo',
    },
    {
      id: 3,
      especialista: 'higienista',
    }

  ]
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

  public equipoAuxiliar = [
    {
      id: 0,
      nombre: 'Pepillo',
      descripcion: 'Att. al paciente, control de calidad y gestión de proveedores',
      imagen: ""
    },
    {
      id: 1,
      nombre: 'Pepin',
      descripcion: 'Recepción y atención al paciente en Odontopediatría',
      imagen: ""
    },
    {
      id: 2,
      nombre: 'Pepe Jesus',
      descripcion: 'Gerente, recursos humanos',
      imagen: ""
    },
    {
      id: 3,
      nombre: 'Pep',
      descripcion: 'Recepcion y admistracion',
      imagen: ""
    }
  ];

  public equipoHiguienista = [
    {
      id: 0,
      nombre: 'Dolores',
      descripcion: 'Att. al paciente, control de calidad y gestión de proveedores',
      imagen: ""
    },
    {
      id: 1,
      nombre: 'Lisney',
      descripcion: 'Recepción y atención al paciente en Odontopediatría',
      imagen: ""
    },
    {
      id: 2,
      nombre: 'Sara',
      descripcion: 'Gerente, recursos humanos',
      imagen: ""
    },
    {
      id: 3,
      nombre: 'Alexis',
      descripcion: 'Recepcion y admistracion',
      imagen: ""
    }
  ];

  public obtenerEquipoPorTipoEspecialista(tipoEspecialista: string) {
    switch (tipoEspecialista) {
      case 'atencion':
        return this.equipoAtencionAlPaciente;
      case 'auxiliar':
        return this.equipoAuxiliar;
      case 'odontologo':
        return this.equipoOdontologos;
      case 'higienista':
        return this.equipoHiguienista;
      default:
        // Puedes manejar un caso por defecto si el tipo de especialista no coincide con ninguna categoría conocida.
        return [];
    }
  }

  obtenerIdTipoEspecialista(){
    return this.tipoEspecialista;
  }

  encontrarEspecialista(ruta:any, id: any){
    const idBuscado = parseInt(id, 10);
    let producto;
    if(ruta == "atencion"){
      producto = this.equipoAtencionAlPaciente.find(equipoAtencionAlPaciente => equipoAtencionAlPaciente.id === idBuscado);
      return producto ? [producto] : [];
    }
    if(ruta == "odontologo"){
      producto = this.equipoOdontologos.find(equipoOdontologos => equipoOdontologos.id === idBuscado);
      return producto ? [producto] : [];
    }
    if(ruta == "higienistas"){
      producto = this.equipoHiguienista.find(equipoHiguienista => equipoHiguienista.id === idBuscado);
      return producto ? [producto] : [];
    }
    if(ruta == "auxiliar"){
      producto = this.equipoAuxiliar.find(equipoAuxiliar => equipoAuxiliar.id === idBuscado);
      
      return producto ? [producto] : [];
    }

    return producto ? [producto] : [];
  }
}
