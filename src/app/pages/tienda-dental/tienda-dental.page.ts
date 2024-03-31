import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/backend/producto.service';
import { ProductoModule } from 'src/app/module/producto/producto.module';

@Component({
  selector: 'app-tienda-dental',
  templateUrl: './tienda-dental.page.html',
  styleUrls: ['./tienda-dental.page.scss'],
  providers:[ProductoModule]
})
export class TiendaDentalPage implements OnInit {

  public store: any = [];

  constructor(public productos: ProductoService) {
   }

  ngOnInit() {
    this.productos.getProdCollection().subscribe(() =>{
      this.store = this.productos.getProductos();
    });
  }

}
