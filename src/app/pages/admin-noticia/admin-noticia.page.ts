import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/backend/noticias.service';
import { Blog } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-noticia',
  templateUrl: './admin-noticia.page.html',
  styleUrls: ['./admin-noticia.page.scss'],
})
export class AdminNoticiaPage implements OnInit {

  constructor(public noticias: NoticiasService, public firestore: FirestoreService) { }

  noticia: Blog[]= [];

  ngOnInit() {
    this.noticias.getBlog().subscribe(() => {
      this.noticia = this.noticias.getNoticias();
    });
  }

}
