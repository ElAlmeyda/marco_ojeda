import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from 'src/app/service/noticias.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.page.html',
  styleUrls: ['./noticia.page.scss'],
})
export class NoticiaPage implements OnInit {

  public noticias: any= [];
  public id:any;

  constructor(private activatedRoute: ActivatedRoute, private noticia:NoticiasService ) { }

  ngOnInit() {

    this.id= this.activatedRoute.snapshot.paramMap.get('id');
    this.noticias = this.noticia.obtenerNoticia(this.id);
  }

}
