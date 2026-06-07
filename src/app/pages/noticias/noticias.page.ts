import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/service/firestore.service';
import { Blog } from 'src/app/model';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {

  noticia: Blog[] = [];
  noticiaSeleccionada: Blog | null = null;

  readonly PATH = 'Blog';

  constructor(public firestore: FirestoreService) {}

  ngOnInit() {
    this.firestore.getCollection<Blog>(this.PATH).subscribe(data => {
      this.noticia = data;
    });
  }

  verDetalle(item: Blog) {
    this.noticiaSeleccionada = item;
    const content = document.querySelector('ion-content');
    if (content) (content as any).scrollToTop(300);
  }

  volver() {
    this.noticiaSeleccionada = null;
    const content = document.querySelector('ion-content');
    if (content) (content as any).scrollToTop(300);
  }
}