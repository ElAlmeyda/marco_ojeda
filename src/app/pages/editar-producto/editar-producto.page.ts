import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.page.html',
  styleUrls: ['./editar-producto.page.scss'],
})
export class EditarProductoPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  
  id: any;
  public producto: any = [];
  imagenSubidaUrl ='';
  file: any;

  editarProducto: Producto = {
    nombre: '',
    descripcion: '',
    foto: '',
    id: '',
    precio: 0
  }
  

  constructor(public productos: ProductoService, public toastController: ToastController, public activatedRoute: ActivatedRoute, public navController: NavController) { 
  }

  async ngOnInit() {
    this.id= this.activatedRoute.snapshot.paramMap.get('id')

    this.productos.getProdCollection().subscribe(() => {
      this.producto = this.productos.getProducto(this.id);
      this.editarProducto = this.producto[0];
    });
  }

  async editar(){
    let fotoSubida = this.editarProducto.foto; 
  
    if (this.file) {
      await this.productos.subirImagen(this.file);
      fotoSubida = this.file.name; 
    }
  
    const check = await this.productos.editarProducto(
      this.editarProducto.nombre,
      this.editarProducto.descripcion,
      fotoSubida, 
      this.editarProducto.precio,
      this.id
    );
  
    if (check) {
      this.mostrarToast("Producto actualizado correctamente");
    } else {
      this.mostrarToast("Error al actualizar el procudto");
    }

    this.navController.back();
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  nuevaImagen(event:any) {
    console.log(event);
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.editarProducto.foto = this.file.name;
      reader.onload = (async (image) =>{
        this.imagenSubidaUrl = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  mostrarTextoSeleccionarFoto(): string {
    return this.editarProducto.foto ? this.editarProducto.foto : 'Seleccionar foto';
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
