import { ActivatedRoute, Router } from "@angular/router";
import { Pedido, Producto, ProductoPedido, Usuario } from "../model";
import { FirestoreAuthService } from "../service/firestore-auth.service";
import { FirestoreService } from "../service/firestore.service";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  path ='Carrito/'
  uid='';
  pedido!: Pedido;
  pedido$ = new Subject<Pedido>;
  cliente!: Usuario;

  constructor(public fireAuth: FirestoreAuthService, public firestore: FirestoreService, public router: Router) { 
    this.fireAuth.stateAuth().subscribe(res => {
      if(res != null){
        this.uid = res.uid;
        this.loadCliente();
        console.log(this.uid);
      }
    });
    this.initCarrito(); // Inicializa el carrito
  }

  initCarrito() {
    this.pedido = {
      cliente: this.cliente,
      productos: [],
      precioTotal: 0,
      estado: '',
      id: this.uid
    }
    this.pedido$.next(this.pedido);
  }

  agregarAlCarrito(prod: Producto) {
    const idProd = prod.id;
    console.log("idProd:", idProd);
    if(this.uid.length){
      const foundIndex = this.pedido.productos.findIndex(item => item.producto.id === prod.id);
      console.log(this.pedido.productos);
      if (foundIndex !== -1) {
        // El producto ya está en el carrito, aumentar la cantidad
        this.pedido.productos[foundIndex].cantidad++;
      } else {
        const add: ProductoPedido = {
          producto: prod,
          cantidad: 1
        };
        this.pedido.productos.push(add);
      }
      this.pedido.estado= 'pendiente';
      this.guardarCarritoEnBD();
    }
  }
  
  obtenerCarrito(){
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    return this.firestore.getDoc<Pedido>(path, this.uid).subscribe(res => {
      if(res){
        this.pedido = res;
        this.pedido$.next(this.pedido);
      } else {
        this.initCarrito();
      }
    console.log(this.pedido);
    });
  }

  loadCliente(){
    const path='Usuarios/'
    return this.firestore.getDoc<Usuario>(path, this.uid).subscribe((res: Usuario | undefined) =>{
      if(res){
        this.cliente = res;
        this.obtenerCarrito();
      }
    });
  }

  eliminarDelCarrito(producto: ProductoPedido) {
    const index = this.pedido.productos.findIndex(p => p.producto.id === producto.producto.id);
    if (index !== -1) {
      this.pedido.productos.splice(index, 1);
      this.guardarCarritoEnBD();
    }
  }
  

  getCarrito(): Observable <Pedido>{
    return this.pedido$.asObservable();
  }

  calcularTotal() {
    // Implementa la lógica para calcular el precio total del carrito
  }

  realizarPedido(){
    // Implementa la lógica para realizar un pedido
  }

  clearCarrito(){
    // Implementa la lógica para limpiar el carrito
  }

  actualizarCantidadEnCarrito(item: ProductoPedido) {
    const foundIndex = this.pedido.productos.findIndex(p => p.producto.id === item.producto.id);
    if (foundIndex !== -1) {
      this.pedido.productos[foundIndex].cantidad = item.cantidad;
      this.guardarCarritoEnBD();
    }
  }

  private guardarCarritoEnBD() {
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    this.firestore.updateDoc(this.pedido, path, this.uid);
  }
}
