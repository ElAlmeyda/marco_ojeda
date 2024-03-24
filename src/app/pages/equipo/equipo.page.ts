import { Component, OnInit, Input } from '@angular/core';
import { Empleado } from 'src/app/model';
import { EquipoModule } from 'src/app/module/equipo/equipo.module';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit {
  [x: string]: any;

  public odontologo: Empleado[]=[];
  public higuienista: any = [];
  public auxiliares: any = [];
  public atencionAlcliente: any = [];

  public equipo: Empleado[] = [];
  private path = 'EquipoClinico/';

  public tiposEspecialistas: any = [];

  constructor(private empleado: EquipoServiceService, public database: FirestoreService) { 

  }

  ngOnInit() {
    this.empleado.getEquipo().subscribe(() => {
      this.odontologo = this.empleado.getOdontologos();
      this.higuienista = this.empleado.getHigienistas();
      this.auxiliares = this.empleado.getAuxiliares();
      this.atencionAlcliente = this.empleado.getAtencion();
      this.tiposEspecialistas = [
        { tipo: 'odontologo', nombre: 'Odontólogos', datos: this.odontologo },
        { tipo: 'higienista', nombre: 'Higienistas', datos: this.higuienista },
        { tipo: 'auxiliar', nombre: 'Auxiliares', datos: this.auxiliares },
        { tipo: 'atencion', nombre: 'Atención al Paciente', datos: this.atencionAlcliente }
      ];
    });
  }
  
}
