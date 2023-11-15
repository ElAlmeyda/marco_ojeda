import { Component, OnInit, Input } from '@angular/core';
import { EquipoModule } from 'src/app/equipo/equipo.module';
import { EquipoServiceService } from 'src/app/service/equipo-service.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit {
  [x: string]: any;

  public equipo = [
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

  constructor() { 

  }

  ngOnInit() {
  }

}
