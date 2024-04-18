import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-producto',
  templateUrl: './admin-producto.page.html',
  styleUrls: ['./admin-producto.page.scss'],
})
export class AdminProductoPage implements OnInit {

  constructor(public productos: ProductoService, public firestore : FirestoreService, public toastController: ToastController, public alertController:AlertController) { }

  producto: Producto[]=[];

  ngOnInit() {
    this.productos.getProdCollection().subscribe(() => {
      this.producto = this.productos.getProductos();
    });
  }

  async delete(empleadoDelete: any){
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
              const idEmpleado = empleadoDelete.id;
              await this.productos.deleteProducto(idEmpleado);
              this.mostrarToast("Producto eliminado correctamente");
            } catch (error) {
              console.error("Error al eliminar el producto:", error);
              this.mostrarToast("Error al eliminar el producto");
            } finally {
              // Cierra la alerta después de ejecutar las operaciones de eliminación
              await alert.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
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
