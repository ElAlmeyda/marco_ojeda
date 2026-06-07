import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit {

  public equipo: Empleado[] = [];
  public tiposEspecialistas: any[] = [];
  public especialistaSeleccionado: any = null;

  readonly PATH = 'Equipo';

  constructor(public firestore: FirestoreService) {}

  ngOnInit() {
    this.cargarEquipo();
  }

  cargarEquipo() {
    this.firestore.getCollection<Empleado>(this.PATH).subscribe(data => {
      console.log('Datos de Firestore:', data); // <-- mira qué valor tiene "tipo"
      this.equipo = data;
      this.agruparPorTipo();
    });
  }

  agruparPorTipo() {
    // Agrupa dinámicamente por lo que venga de Firestore
    const grupos: { [key: string]: Empleado[] } = {};

    for (const empleado of this.equipo) {
      const tipo = empleado.tipo || 'otros';
      if (!grupos[tipo]) grupos[tipo] = [];
      grupos[tipo].push(empleado);
    }

    this.tiposEspecialistas = Object.keys(grupos).map(tipo => ({
      tipo,
      nombre: this.nombreLegible(tipo),
      datos: grupos[tipo]
    }));

    console.log('tiposEspecialistas:', this.tiposEspecialistas); // <-- verifica que se llena
  }

  nombreLegible(tipo: string): string {
    const mapa: { [key: string]: string } = {
      odontologo:  'Odontólogos',
      higienista:  'Higienistas',
      auxiliar:    'Auxiliares',
      atencion:    'Atención al Paciente',
    };
    return mapa[tipo] || tipo;
  }

  verDetalle(item: any) {
    this.especialistaSeleccionado = item;
  }

  volver() {
    this.especialistaSeleccionado = null;
  }
}