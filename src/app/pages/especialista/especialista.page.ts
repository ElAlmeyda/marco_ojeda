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

  public especialista: any = [];
  public id:any;
  tipo: string | null='';
  

  constructor(
    private http: HttpClient, 
    private activatedRoute: ActivatedRoute,
    public equipoService: EquipoServiceService
    ) { 
      
  }

  ngOnInit() {

    this.tipo= this.activatedRoute.snapshot.paramMap.get('tipo')
    this.id= this.activatedRoute.snapshot.paramMap.get('id')


    //this.especialista= this.equipoService.encontrarEspecialista(this.tipo, this.id);
  }


}
