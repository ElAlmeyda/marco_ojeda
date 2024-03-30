import { Component, OnInit } from '@angular/core';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Empleado } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-equipo',
  templateUrl: './admin-equipo.page.html',
  styleUrls: ['./admin-equipo.page.scss'],
})
export class AdminEquipoPage implements OnInit {

  constructor(public empleado: EquipoServiceService, public firestore : FirestoreService) { }

  equipo: Empleado[]=[];

  ngOnInit() {
    this.empleado.getEquipo().subscribe(() => {
      this.equipo = this.empleado.getEmpleados();
    });
  }

}
