import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.page.html',
  styleUrls: ['./editar-producto.page.scss'],
})
export class EditarProductoPage implements OnInit {

  id: any;
  public producto: any = [];

  editarProducto: Producto = {
    nombre: '',
    descripcion: '',
    foto: '',
    id: '',
    precio: 0
  }
  

  constructor(public productos: ProductoService, public toastController: ToastController, public activatedRoute: ActivatedRoute) { 
  }

  async ngOnInit() {
    this.id= this.activatedRoute.snapshot.paramMap.get('id')

    this.productos.getProdCollection().subscribe(() => {
      this.producto = this.productos.getProducto(this.id);
    });
  }

  async editar(){
    try {
      await this.productos.editarProducto(this.editarProducto.nombre, this.editarProducto.descripcion, this.editarProducto.foto, this.editarProducto.precio, this.id);
      // Si no se ha lanzado ninguna excepción, significa que se ha creado el empleado correctamente
      this.mostrarToast("Empleado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizado el empleado:", error);
      this.mostrarToast("Error al actualizado el empleado");
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
