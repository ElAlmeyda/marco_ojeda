import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../backend/carrito.service';
import { Pedido, Producto, ProductoPedido, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { async } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  
  uid='';
  cliente !: Usuario;
  public carrito: Pedido = {
    cliente: this.cliente,
    productos: [],
    precioTotal: 0,
    estado: '',
    id: ''
  };

  public productoPedido!: ProductoPedido;

  public producto: Producto={
    nombre: '',
    descripcion: '',
    foto: '',
    precio: 0,
    id: '',
  }

  constructor(private carritoService: CarritoService, public fireAuth: FirestoreAuthService, public toastController: ToastController) { 
    this.fireAuth.stateAuth().subscribe(res => {
      if(res != null){
        this.uid = res.uid;
        this.cargarPedido();
      }
    });
  }

  ngOnInit() {
    
  }

  cargarPedido(){
    this.carritoService.getCarrito().subscribe(res =>{
      this.carrito = res;
      console.log(this.carrito);
    });
  }


  eliminarDelCarrito(producto: ProductoPedido) {
    this.carritoService.eliminarDelCarrito(producto);
  }

  mas(item: ProductoPedido){
    if(item.cantidad < 10){
      item.cantidad++;
    this.carritoService.actualizarCantidadEnCarrito(item);
    }
    
  }

  menos(item: ProductoPedido){
    if(item.cantidad > 1){
      item.cantidad--;
      this.carritoService.actualizarCantidadEnCarrito(item);
    }
  }

  limpiarCarrito(){
      this.carritoService.clearCarrito();
  }

  calcularTotalEnCarrito(){
    return this.carrito.precioTotal= this.carritoService.calcularTotal();
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración del toast en milisegundos
      position: 'bottom' // Posición del toast en la pantalla
    });
    toast.present();
  }
}
