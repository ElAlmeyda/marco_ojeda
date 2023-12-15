import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/service/carrito.service';
import { ProductoModule } from 'src/app/module/producto/producto.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  providers: [ProductoModule]
})
export class ProductoPage implements OnInit {

  public product: any = [];
  public id:any;

  constructor(public store: ProductoModule, public router: ActivatedRoute) {
  }

  ngOnInit() {
    this.id= this.router.snapshot.paramMap.get('id');
    this.product = this.store.obtenerProducto(this.id);
  }

  anadirCarrito(){
    //this.carrito.agregarAlCarrito(this.product);
  }

}
