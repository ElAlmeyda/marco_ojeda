import { Component, OnInit } from '@angular/core';
import { ProductoModule } from 'src/app/module/producto/producto.module';

@Component({
  selector: 'app-tienda-dental',
  templateUrl: './tienda-dental.page.html',
  styleUrls: ['./tienda-dental.page.scss'],
  providers:[ProductoModule]
})
export class TiendaDentalPage implements OnInit {

  public store: any = [];

  constructor(private producto: ProductoModule) {
   }

  ngOnInit() {
    this.store= this.producto.obtenerListaDeProductos();
  }

}
