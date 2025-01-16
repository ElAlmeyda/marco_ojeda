import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../backend/carrito.service';
import { Pedido, Producto, ProductoPedido, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/backend/producto.service';
import { loadStripe } from '@stripe/stripe-js';
import { FirestoreService } from 'src/app/service/firestore.service';



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
  pedidos: Pedido[]=[];

  public productoPedido!: ProductoPedido;
  private stripe: any;

  public producto: Producto={
    nombre: '',
    descripcion: '',
    foto: '',
    precio: 0,
    id: '',
  }
  estado='';
  idPedido='';

  constructor(private carritoService: CarritoService, public fireAuth: FirestoreAuthService, public toastController: ToastController, public router: Router,
              public alertController: AlertController, public productos: ProductoService, private route: ActivatedRoute, public firestore: FirestoreService
  ) { 
    this.route.queryParams.subscribe(params => {
      this.estado = params['status'];  
      this.idPedido = params['orderId'];  
    
      if (this.estado === 'success') {
        this.firestore.getUserPedidos().subscribe({
          next: (pedidos) => {
            const pedido = this.pedidos = pedidos.find(p => p.id === this.idPedido);
            if (pedido) {
              this.carritoService.comprado(pedido);
              this.mostrarToast('¡Tu pedido ha sido procesado con éxito! Lo encontrará en su perfil');
            }
          }
        });
      } else if (this.estado === 'cancel') {
        this.mostrarToast('El pago ha sido cancelado. Intentelo de nuevo.');
      }
    });
  }

  ngOnInit() {
    this.fireAuth.stateAuth().subscribe(async res => {
      if(res != null){
        this.uid = res.uid;
        this.cargarPedido();
      }
    });
  }

  async actualizarImagenes() {
    for (const prodPedido of this.carrito.productos) {
      if (prodPedido.producto.foto) {
        try {
          const url = await this.productos.getDownloadUrl(prodPedido.producto.foto).toPromise();
          prodPedido.producto.foto = url;
        } catch (error) {
          console.error('Error al obtener URL de descarga:', error);
        }
      }
    }
  }

  cargarPedido() {
    this.carritoService.getCarrito().subscribe(res => {
      if(res.estado === 'pendiente'){
        this.carrito = res;
        this.actualizarImagenes();
      }
    });
  }

  async procesarPago() {
    try {
      console.log('Contenido del carrito:', this.carrito); // <-- Revisa el carrito al iniciar
  
      this.stripe = await loadStripe('pk_test_51QS06lKujQS3YPoU2aMt9ZACEyrq5dgTvsHLu4ABpGhrxACtQ23kZ0cHjU1i82kYjUFDGESQzgDBvknugJkItBlG00XYcD99RX');
      if (!this.stripe) {
        this.mostrarToast('Error al cargar Stripe. Intenta más tarde.');
        return;
      }
  
      const productosStripe = this.mapearCarritoAProductosStripe(this.carrito);
      console.log('Productos para Stripe:', productosStripe); // <-- Verifica los productos mapeados
  
      const session = await this.crearSesionDePago(productosStripe, this.carrito);
      await this.redirigirAStripe(session.id);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      this.mostrarToast('Hubo un problema al procesar tu pago. Intenta nuevamente.');
    }
  }
  
  private mapearCarritoAProductosStripe(carrito: any): any[] {
    
    const productosCarrito = carrito.productos;

    if (!productosCarrito.length) {
      throw new Error('El carrito está vacío o los datos no son válidos');
    }
  
    return productosCarrito.map((item: any) => {
      if (!item.producto || !item.producto.nombre || !item.producto.precio || !item.cantidad) {
        console.error('Producto inválido en el carrito:', item); // <-- Log detallado de cada producto
        throw new Error('Faltan datos en algún producto del carrito');
      }
  
      return {
        name: item.producto.nombre,
        price: Math.round(Number(item.producto.precio) * 100),
        quantity: item.cantidad,
      };
    });
  }
  
  private async crearSesionDePago(productos: any[], carrito: any): Promise<any> {
  
    const response = await fetch('https://us-central1-servicio-4f831.cloudfunctions.net/createCheckoutSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: productos, pedido_id: carrito.id  }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del backend:', errorText); // <-- Registra el error del backend
      throw new Error(`Error al crear la sesión de pago: ${errorText}`);
    }
  
    return response.json();
  }
  
  private async redirigirAStripe(sessionId: string): Promise<void> {
    const { error } = await this.stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error al redirigir a Stripe Checkout:', error);
      throw new Error('Error al redirigir al pago. Intenta nuevamente.');
    }
    
  }
  

  async eliminarDelCarrito(producto: ProductoPedido) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.carritoService.eliminarDelCarrito(producto);;
              this.mostrarToast("Producto eliminado del carrito");
            } catch (error) {
              console.error("Error al eliminar el producto:", error);
              this.mostrarToast("Error al eliminar el producto");
            }finally {
              // Cierra la alerta después de ejecutar las operaciones de eliminación
              await alert.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
    
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
