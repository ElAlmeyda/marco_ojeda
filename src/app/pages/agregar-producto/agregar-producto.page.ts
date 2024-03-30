import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {

  producto: Producto = {
    nombre: '',
    descripcion: '',
    foto: '',
    precio: 0,
    id: '',
  };

  constructor(public productos: ProductoService, public toastController: ToastController) { }

  ngOnInit() {
  }

  async guardar(){
    try {
      await this.productos.crearProducto(this.producto.nombre, this.producto.descripcion, this.producto.foto, this.producto.precio);
      // Si no se ha lanzado ninguna excepción, significa que se ha creado el empleado correctamente
      this.mostrarToast("Producto creado correctamente");
    } catch (error) {
      console.error("Error al crear el Producto:", error);
      this.mostrarToast("Error al crear el Producto");
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
