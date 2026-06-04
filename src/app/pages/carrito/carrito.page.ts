import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../backend/carrito.service';
import { Pedido, Producto, ProductoPedido, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/backend/producto.service';
import { IPayPalConfig } from 'ngx-paypal';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  paypalConfig: IPayPalConfig = {
    clientId: 'ATGqZVkzWtnaIj-9WsFB3t2Yi3UuZFs82d14BaFccCeqg_zED4mt9Yp9y6TaUZJQFc4huYbVVeb2adCz',
    currency: 'USD',
  };

  uid = '';
  cliente!: Usuario;

  public carrito: Pedido = {
    cliente: this.cliente,
    productos: [],
    precioTotal: 0,
    estado: '',
    id: '',
    clienteId:''
  };

  public productoPedido!: ProductoPedido;

  public producto: Producto = {
    nombre: '',
    descripcion: '',
    imagenUrl: '',
    precio: 0,
    id: '',
    categoria:''
  };

  constructor(
    private carritoService: CarritoService,
    public fireAuth: FirestoreAuthService,
    public toastController: ToastController,
    public router: Router,
    public alertController: AlertController,
    public productos: ProductoService
  ) {}

  ngOnInit() {
    this.fireAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        this.cargarPedido();
      }
    });
  }

  // ── Carga del pedido ──────────────────────────────────────────────────────
  cargarPedido() {
    this.carritoService.getCarrito().subscribe(res => {
      this.carrito = res;
      this.actualizarImagenes();
    });
  }

  async actualizarImagenes() {
    for (const prodPedido of this.carrito.productos) {
      if (prodPedido.producto.imagenUrl) {
        try {
          const url = await this.productos.getDownloadUrl(prodPedido.producto.imagenUrl).toPromise();
          prodPedido.producto.imagenUrl = url;
        } catch (error) {
          console.error('Error al obtener URL de descarga:', error);
        }
      }
    }
  }

  // ── Cálculo del total ─────────────────────────────────────────────────────
  calcularTotalEnCarrito() {
    return this.carrito.precioTotal = this.carritoService.calcularTotal();
  }

  // ── Gestión de cantidades ─────────────────────────────────────────────────
  mas(item: ProductoPedido) {
    if (item.cantidad < 10) {
      item.cantidad++;
      this.carritoService.actualizarCantidadEnCarrito(item);
    }
  }

  menos(item: ProductoPedido) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.carritoService.actualizarCantidadEnCarrito(item);
    }
  }

  // ── Eliminar con confirmación ─────────────────────────────────────────────
  async eliminarDelCarrito(producto: ProductoPedido) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.carritoService.eliminarDelCarrito(producto);
              this.mostrarToast('Producto eliminado del carrito');
            } catch (error) {
              console.error('Error al eliminar el producto:', error);
              this.mostrarToast('Error al eliminar el producto');
            } finally {
              await alert.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Vaciar carrito ────────────────────────────────────────────────────────
  limpiarCarrito() {
    this.carritoService.clearCarrito();
  }

  // ── Toast helper ──────────────────────────────────────────────────────────
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // ── PayPal ────────────────────────────────────────────────────────────────
  onPaymentSuccess(event: any) {
    console.log('Pago completado:', event);
    this.carrito.estado = 'aceptado';
    this.carritoService.comprado(this.carrito);
  }
}