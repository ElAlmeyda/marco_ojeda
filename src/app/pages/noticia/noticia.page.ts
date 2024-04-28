import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from 'src/app/backend/noticias.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.page.html',
  styleUrls: ['./noticia.page.scss'],
})
export class NoticiaPage implements OnInit {

  public noticia: any= [];
  public id:any;

  constructor(private activatedRoute: ActivatedRoute, private noticias:NoticiasService ) { }

  ngOnInit() {

    this.id= this.activatedRoute.snapshot.paramMap.get('id');
    this.noticias.getBlog().subscribe(() => {
      this.noticia= this.noticias.getNoticia(this.id);
      this.actualizarImagenes(this.noticia);

    });
  }

  async actualizarImagenes(noticiaF: any[]) {
    for (const noti of noticiaF) {
      if (noti.foto) {
        try {
          const url = await this.noticias.getDownloadUrl(noti.foto).subscribe(
            (url: string) => {
              noti.imagenUrl = url;
            },
            (error) => {
              console.error('Error al obtener URL de descarga:', error);
            }
          );
          noti.imagenUrl = url;
        } catch (error) {
          console.error('Error al obtener URL de descarga:', error);
        }
      }
    }
  }



}
