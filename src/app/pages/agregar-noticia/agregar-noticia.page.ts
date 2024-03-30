import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NoticiasService } from 'src/app/backend/noticias.service';
import { Blog } from 'src/app/model';

@Component({
  selector: 'app-agregar-noticia',
  templateUrl: './agregar-noticia.page.html',
  styleUrls: ['./agregar-noticia.page.scss'],
})
export class AgregarNoticiaPage implements OnInit {

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
      await this.noticias.crearNoticia(this.noticia.titulo, this.noticia.descripcion, this.noticia.foto);
      // Si no se ha lanzado ninguna excepción, significa que se ha creado el empleado correctamente
      this.mostrarToast("Noticia creado correctamente");
    } catch (error) {
      console.error("Error al crear el Noticia:", error);
      this.mostrarToast("Error al crear el Noticia");
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
