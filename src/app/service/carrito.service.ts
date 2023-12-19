import { Injectable } from '@angular/core';
import { ProductoModule } from '../module/producto/producto.module';

@Injectable({
  providedIn: 'root'
})

export class CarritoService {

  
  public carrito: ProductoModule[] = [];
  totalPrecio: number =0;

  constructor() { }

  agregarAlCarrito(producto: ProductoModule) : void {
    this.carrito.push(producto);
  }
  

  obtenerCarrito(){
    return this.carrito;
  }

  eliminarDelCarrito(indice: number) {
    if (indice >= 0 && indice < this.carrito.length) {
      this.carrito.splice(indice, 1);
    }
  }

  calcularTotal() {
    
  }
}
