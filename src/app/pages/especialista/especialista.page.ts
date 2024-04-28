import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoPage } from '../equipo/equipo.page';


import { HttpClient } from '@angular/common/http'
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';


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
    this.id= this.activatedRoute.snapshot.paramMap.get('id')
    this.equipoService.getEquipo().subscribe(() => {
      this.especialista= this.equipoService.getEspecialista(this.id);
      this.actualizarImagenes(this.especialista);
    });

  }

  async actualizarImagenes(especialista: any[]) {
    for (const odontologo of especialista) {
      if (odontologo.foto) {
        try {
          const url = await this.equipoService.getDownloadUrl(odontologo.foto).subscribe(
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

}
