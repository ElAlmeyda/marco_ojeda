import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-producto',
  templateUrl: './admin-producto.page.html',
  styleUrls: ['./admin-producto.page.scss'],
})
export class AdminProductoPage implements OnInit {

  constructor(public productos: ProductoService, public firestore : FirestoreService) { }

  producto: Producto[]=[];

  ngOnInit() {
    this.productos.getProdCollection().subscribe(() => {
      this.producto = this.productos.getProductos();
    });
  }

}
