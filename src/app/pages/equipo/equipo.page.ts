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

  public tiposEspecialistas: any = [];

  constructor(private producto: EquipoServiceService) { 

  }

  ngOnInit() {
    this.atencionAlcliente=this.producto.obtenerEquipoPorTipoEspecialista('atencion');
    this.odontologo=this.producto.obtenerEquipoPorTipoEspecialista('odontologo');
    this.higuienista=this.producto.obtenerEquipoPorTipoEspecialista('higienista');
    this.auxiliares=this.producto.obtenerEquipoPorTipoEspecialista('auxiliar');
    this.tiposEspecialistas = [
      { tipo: 'odontologo', nombre: 'Odontólogos', datos: this.odontologo },
      { tipo: 'higienista', nombre: 'Higienistas', datos: this.higuienista },
      { tipo: 'auxiliar', nombre: 'Auxiliares', datos: this.auxiliares },
      { tipo: 'atencion', nombre: 'Atención al Paciente', datos: this.atencionAlcliente }
    ];
  }

}
