import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NoticiasService } from 'src/app/backend/noticias.service';
import { Blog } from 'src/app/model';

@Component({
  selector: 'app-agregar-noticia',
  templateUrl: './agregar-noticia.page.html',
  styleUrls: ['./agregar-noticia.page.scss'],
})
export class AgregarNoticiaPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  imagenSubidaUrl ='';
  file: any;

  noticia: Blog = {
    titulo: '',
    descripcion: '',
    foto: '',
    id: '',
    fecha: new Date()
  };

  constructor(public noticias: NoticiasService, public toastController: ToastController) { }

  ngOnInit() {
  }

  async guardar(){
    try {
      await this.noticias.crearNoticia(this.noticia.titulo, this.noticia.descripcion, this.file.name);
      await this.noticias.subirImagen(this.file);
      // Si no se ha lanzado ninguna excepción, significa que se ha creado el empleado correctamente
      this.mostrarToast("Noticia creado correctamente");
      this.initNoticia();
    } catch (error) {
      console.error("Error al crear el Noticia:", error);
      this.mostrarToast("Error al crear el Noticia");
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  nuevaImagen(event:any) {
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.noticia.foto = this.file.name;
      reader.onload = (async (image) =>{
        this.imagenSubidaUrl = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
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

  mostrarTextoSeleccionarFoto(): string {
    return this.noticia.foto ? this.noticia.foto : 'Seleccionar foto';
  }

  initNoticia(){
    this.noticia = {
      titulo: '',
      descripcion: '',
      foto: '',
      id: '',
      fecha: new Date()
    };
  
  }

}
