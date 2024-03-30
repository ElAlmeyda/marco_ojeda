import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-producto',
  templateUrl: './admin-producto.page.html',
  styleUrls: ['./admin-producto.page.scss'],
})
export class AdminProductoPage implements OnInit {

  constructor(public productos: ProductoService, public firestore : FirestoreService, public toastController: ToastController) { }

  producto: Producto[]=[];

  ngOnInit() {
    this.productos.getProdCollection().subscribe(() => {
      this.producto = this.productos.getProductos();
    });
  }

  async delete(empleadoDelete: any){
    try {
      const idEmpleado = empleadoDelete.id;
      await this.productos.deleteProducto(idEmpleado);
      this.mostrarToast("Empleado eliminado correctamente");
    } catch (error) {
      console.error("Error al crear el empleado:", error);
      this.mostrarToast("Error al crear el empleado");
    }
    
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
