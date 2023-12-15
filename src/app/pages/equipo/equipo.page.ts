import { Component, OnInit, Input } from '@angular/core';
import { EquipoModule } from 'src/app/module/equipo/equipo.module';
import { EquipoServiceService } from 'src/app/service/equipo-service.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit {
  [x: string]: any;

  public odontologo: any = [];
  public higuienista: any = [];
  public auxiliares: any = [];
  public atencionAlcliente: any = [];

  constructor(private producto: EquipoServiceService) { 

  }

  ngOnInit() {
    this.atencionAlcliente= this.producto.obtenerAtencionAlPaciente();
    this.odontologo= this.producto.obtenerOdontologo();
  }

}
