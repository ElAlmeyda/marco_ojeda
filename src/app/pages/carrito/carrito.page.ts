import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../backend/carrito.service';
import { Pedido, Producto, ProductoPedido, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/backend/producto.service';
import { StripeService } from 'src/app/backend/stripe.service';
import { loadStripe } from '@stripe/stripe-js';


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
  private stripe: any;

  public producto: Producto={
    nombre: '',
    descripcion: '',
    foto: '',
    precio: 0,
    id: '',
  }
  estado='';
  mensaje='';

  constructor(private carritoService: CarritoService, public fireAuth: FirestoreAuthService, public toastController: ToastController, public router: Router,
              public alertController: AlertController, public productos: ProductoService, public stripeService: StripeService, private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      this.estado = params['status'];  // Puede ser 'success' o 'cancel'
      
      // Mostrar un mensaje en función del estado del pago
      if (this.estado === 'success') {
        this.mensaje = '¡Tu pedido ha sido procesado con éxito!';
      } else if (this.estado === 'cancel') {
        this.mensaje = 'El pago ha sido cancelado. Intenta nuevamente.';
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

  cargarPedido(){
    this.carritoService.getCarrito().subscribe(res =>{
      this.carrito = res;
      this.actualizarImagenes();
      console.log(this.carrito);
    });
  }

  async procesarPago() {
    // Cargar Stripe
    await loadStripe('pk_test_51QS06lKujQS3YPoU2aMt9ZACEyrq5dgTvsHLu4ABpGhrxACtQ23kZ0cHjU1i82kYjUFDGESQzgDBvknugJkItBlG00XYcD99RX')
      .then((stripe) => {
        this.stripe = stripe;
      })
      .catch((error) => {
        console.error('Error al cargar Stripe:', error);
        this.mostrarToast('Error al cargar Stripe. Intenta más tarde.');
      });

    // Productos (pasa tu propio carrito aquí)
    const productos = [
      { nombre: 'Producto 1', precio: 2000, cantidad: 1 },
      { nombre: 'Producto 2', precio: 1500, cantidad: 2 },
    ];

    try {
      // Llamada al backend para crear la sesión de pago
      const response = await fetch('https://us-central1-servicio-4f831.cloudfunctions.net/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: productos }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la sesión de pago');
      }

      const session = await response.json();

      // Redirigir al usuario a Stripe Checkout
      const { error } = await this.stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error('Error al redirigir a Stripe Checkout:', error);
        this.mostrarToast('Error al redirigir al pago. Intenta nuevamente.');
        return;
      }

      // Si no hay errores, el flujo continúa en Stripe Checkout
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      this.mostrarToast('Hubo un problema al procesar tu pago. Intenta nuevamente.');
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

  onPaymentSuccess(event:any) {
    console.log('Pago completado:', event);
    this.carrito.estado = "aceptado";
    this.carritoService.comprado(this.carrito);
  }
}
