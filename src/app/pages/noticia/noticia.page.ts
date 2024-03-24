import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from 'src/app/service/noticias.service';

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
    });
  }

}
