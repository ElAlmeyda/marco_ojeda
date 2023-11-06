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

  public equipo: EquipoModule = [];

  constructor(private equipos:EquipoServiceService) { 

    this.equipo =this.equipos.equipo;
  }

  ngOnInit() {
  }

}
