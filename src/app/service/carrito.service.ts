import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CarritoService {

  
  productos = [];

  constructor() { }

  agregarAlCarrito(){
    this.productos.push();
  }

  obtenerCarrito(){
    return this.productos;
  }

  calcularTotal() {
    // Lógica para calcular el total del carrito
  }
}
