import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;

  imagenSubidaUrl ='';
  file: any;

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
      await this.productos.crearProducto(this.producto.nombre, this.producto.descripcion, this.file.name, this.producto.precio);
      await this.productos.subirImagen(this.file);
      // Si no se ha lanzado ninguna excepción, significa que se ha creado el empleado correctamente
      this.mostrarToast("Producto creado correctamente");
      this.initProducto();
    } catch (error) {
      console.error("Error al crear el Producto:", error);
      this.mostrarToast("Error al crear el Producto");
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  nuevaImagen(event:any) {
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.producto.foto = this.file.name;
      reader.onload = (async (image) =>{
        this.imagenSubidaUrl = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  mostrarTextoSeleccionarFoto(): string {
    return this.producto.foto ? this.producto.foto : 'Seleccionar foto';
  }


  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración del toast en milisegundos
      position: 'bottom' // Posición del toast en la pantalla
    });
    toast.present();
  }

  initProducto(){
    this.producto = {
      nombre: '',
      descripcion: '',
      foto: '',
      precio: 0,
      id: '',
    }
  }
}
