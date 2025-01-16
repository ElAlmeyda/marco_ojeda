import { ActivatedRoute, Router } from "@angular/router";
import { Pedido, Producto, ProductoPedido, Usuario } from "../model";
import { FirestoreAuthService } from "../service/firestore-auth.service";
import { FirestoreService } from "../service/firestore.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  path ='Carrito'
  uid='';
  pedido!: Pedido;
  pedido$ = new Subject<Pedido>;
  cliente!: Usuario;


  constructor(public fireAuth: FirestoreAuthService, public firestore: FirestoreService, public router: Router, public firestroreAuth: FirestoreAuthService) { 
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
      estado: 'pendiente',
      id: this.uid
    }
    this.pedido$.next(this.pedido);
  }

  agregarAlCarrito(prod: Producto) {
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    if(this.uid.length){
      const foundIndex = this.pedido.productos.findIndex(item => item.producto.id === prod.id);
      if (foundIndex !== -1) {
        // El producto ya está en el carrito, aumentar la cantidad
        this.pedido.productos[foundIndex].cantidad++;
        this.calcularTotal();
      } else {
        const add: ProductoPedido = {
          producto: prod,
          cantidad: 1
        };
        this.pedido.productos.push(add);
        this.calcularTotal();
        this.firestore.creatDoc(this.pedido,path, this.uid)
      }
      this.pedido.estado= 'pendiente';
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
      this.calcularTotal();
      this.guardarCarritoEnBD();
    }
  }
  

  getCarrito(): Observable <Pedido>{
    setTimeout(()=>{
      this.pedido$.next(this.pedido);
    }, 100);
    return this.pedido$.asObservable();
  }

  getPedidoId(id:string): Observable<Pedido | null> {
    return this.pedido$.asObservable().pipe(
      map((pedido: Pedido) => pedido.id === id ? pedido : null)
    );
  }

  calcularTotal() {
    let precioFinal = 0;
    for (const item of this.pedido.productos) {
      precioFinal += item.producto.precio * item.cantidad;
    }
    this.pedido.precioTotal = precioFinal
    return this.pedido.precioTotal;
  }

  clearCarrito(){
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    this.initCarrito();
    this.calcularTotal();
    this.firestore.updateDoc(this.pedido, path, this.uid);
    this.pedido$.next(this.pedido);
  }

  actualizarCantidadEnCarrito(item: ProductoPedido) {
    const foundIndex = this.pedido.productos.findIndex(p => p.producto.id === item.producto.id);
    if (foundIndex !== -1) {
      this.pedido.productos[foundIndex].cantidad = item.cantidad;
      this.calcularTotal();
      this.guardarCarritoEnBD();
    }
  }

  guardarCarritoEnBD() {
    const path = '/Usuarios/' + this.uid + '/' + this.path;
    this.firestore.updateDoc(this.pedido, path, this.uid);
  }

  public async comprado(pedido: Pedido): Promise<void> {
    try {
      const path = '/Usuarios/' + this.uid + '/Pedido';
      pedido.estado = "pagado";
      pedido.id = this.firestore.getId();
      await this.firestore.creatDoc(pedido, path, pedido.id);

      this.pedido = {
        cliente: this.cliente,
        productos: [],
        precioTotal: 0,
        estado: 'pendiente',
        id: this.uid
      }
      this.pedido$.next(this.pedido);
      
    } catch (error) {
      console.error('Error en el método comprado:', error);
      throw new Error('No se pudo completar la operación de compra.');
    }
  }

  updatePedido(item: Pedido){
    return this.firestore.updatePedido("entregado", item.cliente.uid, item.id);
  }
}
