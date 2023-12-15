import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../service/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  cantidad: number=1;
  precio: number =10;
  precio_final:number=0;

  public carrito = [];

  constructor(private carritoService: CarritoService) { 
    
  }

  ngOnInit() {
  }

  mas(){
    if(this.cantidad<10){
      this.cantidad= this.cantidad+1;
      this.precio_final= this.precio * this.cantidad;
    }
  }

  menos(){
    if(this.cantidad> 1){
      this.cantidad= this.cantidad-1;
      this.precio_final= this.precio * this.cantidad;
    }
    
  }
}
