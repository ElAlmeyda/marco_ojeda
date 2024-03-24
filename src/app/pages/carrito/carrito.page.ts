import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../backend/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  cantidad: number=1;
  precio: number =10;
  precio_final:number=0;

  public carrito: any = [];

  constructor(private carritoService: CarritoService) { 
    
  }

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  private actualizarProductosEnCarrito() {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  eliminarDelCarrito(indice: number) {
    this.carritoService.eliminarDelCarrito(indice);
    this.actualizarProductosEnCarrito();
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
