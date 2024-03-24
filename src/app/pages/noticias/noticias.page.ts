import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/backend/noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {

  public noticias: any = []

  constructor(private producto: NoticiasService) { }

  ngOnInit() {
    this.producto.getBlog().subscribe(() => {
      this.noticias = this.producto.getNoticias();
    });
  }

}
