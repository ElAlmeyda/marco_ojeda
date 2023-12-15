import { Injectable } from '@angular/core';
import { ProductoModule } from '../module/producto/producto.module';

@Injectable({
  providedIn: 'root'
})

export class CarritoService {

  
  public carrito: ProductoModule[] = [];

  constructor() { }

  agregarAlCarrito(producto: ProductoModule) : void {
    this.carrito.push(producto);
  }


  obtenerProducto(){
    
  }
  

  obtenerCarrito(){
    return this.carrito;
  }

  calcularTotal() {
    // Lógica para calcular el total del carrito
  }
}
