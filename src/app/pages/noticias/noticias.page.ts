import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/backend/noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {

  noticia: any[] = [];
  noticiaSeleccionada: any = null;

  constructor(private producto: NoticiasService) { }

  ngOnInit() {
    this.producto.getBlog().subscribe(() => {
      this.noticia = this.producto.getNoticias();
    });
  }

  verDetalle(item: any) {
    this.noticiaSeleccionada = item;
    // Sube al inicio del scroll al abrir el detalle
    const content = document.querySelector('ion-content');
    if (content) (content as any).scrollToTop(300);
  }

  volver() {
    this.noticiaSeleccionada = null;
    const content = document.querySelector('ion-content');
    if (content) (content as any).scrollToTop(300);
  }

}