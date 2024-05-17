import { ActivatedRoute, Router } from "@angular/router";
import { Pedido, Producto, ProductoPedido, Usuario } from "../model";
import { FirestoreAuthService } from "../service/firestore-auth.service";
import { FirestoreService } from "../service/firestore.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";

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
    const path = '/Usuarios/' + this.uid + '/' + this.path;
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
        this.firestore.creatDoc(this.pedido,path, this.uid)
      }
      this.pedido.estado= 'pendiente';
      this.calcularTotal();
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
    setTimeout(()=>{
      this.pedido$.next(this.pedido);
    }, 100);
    return this.pedido$.asObservable();
  }

  calcularTotal() {
    let precioFinal = 0;
    for (const item of this.pedido.productos) {
      precioFinal += item.producto.precio * item.cantidad;
    }
    this.pedido.precioTotal = precioFinal
    return this.pedido.precioTotal;
  }

  realizarPedido(){
    // Implementa la lógica para realizar un pedido
  }

  clearCarrito(){
    this.initCarrito(); // Reinicializa el carrito al estado inicial
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
