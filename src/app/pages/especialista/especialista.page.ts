import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoPage } from '../equipo/equipo.page';

import { HttpClient } from '@angular/common/http'
import { EquipoServiceService } from 'src/app/service/equipo-service.service';


@Component({
  selector: 'app-especialista',
  templateUrl: './especialista.page.html',
  styleUrls: ['./especialista.page.scss'],
})
export class EspecialistaPage implements OnInit {

  public especialista = [];
  public id:any;
  

  constructor(
    private http: HttpClient, 
    private activatedRoute: ActivatedRoute,
    public equipoService: EquipoServiceService
    ) { 
      
  }

  ngOnInit() {
    this.id= this.activatedRoute.snapshot.paramMap.get('id');

    let especial = this.equipoService.encontrarEspecialista(this.id);
   
  }


}
