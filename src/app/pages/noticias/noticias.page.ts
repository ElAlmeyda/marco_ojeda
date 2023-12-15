import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/service/noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {

  public noticias: any = []

  constructor(private producto: NoticiasService) { }

  ngOnInit() {
    this.noticias= this.producto.obtenerListaDeNoticia();
  }

}
