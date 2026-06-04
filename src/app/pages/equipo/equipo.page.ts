import { Component, OnInit, Input } from '@angular/core';
import { Empleado } from 'src/app/model';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { LoadingService } from 'src/app/backend/loading.service';

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

  constructor(private empleado: EquipoServiceService, public database: FirestoreService, private loadingService: LoadingService) { 

  }

  ngOnInit() {
    this.empleado.getEquipo().subscribe(() => {
      this.odontologo = this.empleado.getOdontologos();
      this.actualizarImagenes(this.odontologo);
      this.higuienista = this.empleado.getHigienistas();
      this.actualizarImagenes(this.higuienista);
      this.auxiliares = this.empleado.getAuxiliares();
      this.actualizarImagenes(this.auxiliares);
      this.atencionAlcliente = this.empleado.getAtencion();
      this.actualizarImagenes(this.atencionAlcliente);
      this.tiposEspecialistas = [
        { tipo: 'odontologo', nombre: 'Odontólogos', datos: this.odontologo },
        { tipo: 'higienista', nombre: 'Higienistas', datos: this.higuienista },
        { tipo: 'auxiliar', nombre: 'Auxiliares', datos: this.auxiliares },
        { tipo: 'atencion', nombre: 'Atención al Paciente', datos: this.atencionAlcliente }
      ];
    });
  }

  actualizarImagenes(equipo: any[]) {
    for (const odontologo of equipo) {
      if (odontologo.foto) {
        try {
          const url = this.empleado.getDownloadUrl(odontologo.foto).subscribe(
            (url: string) => {
              odontologo.imagenUrl = url;
            },
            (error) => {
              console.error('Error al obtener URL de descarga:', error);
            }
          );
          odontologo.imagenUrl = url;
        } catch (error) {
          console.error('Error al obtener URL de descarga:', error);
        }
      }
    }
  }

  especialistaSeleccionado: any = null;

  verDetalle(item: any) {
    this.especialistaSeleccionado = item;
  }

  volver() {
    this.especialistaSeleccionado = null;
  }
  
}
