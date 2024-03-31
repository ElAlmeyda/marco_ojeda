import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/backend/carrito.service';
import { ProductoModule } from 'src/app/module/producto/producto.module';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  providers: []
})
export class ProductoPage implements OnInit {

  public product: any = [];
  public id:any;

  constructor(public router: ActivatedRoute, private carrito: CarritoService, public producto: ProductoService) {
  }

  ngOnInit() {
    this.id= this.router.snapshot.paramMap.get('id');
    this.producto.getProdCollection().subscribe(()=>{
      this.product = this.producto.getProducto(this.id);
    });
    console.log(this.carrito);
  }

  anadirCarrito(item: Producto){
    this.carrito.agregarAlCarrito(item);
  }

}
