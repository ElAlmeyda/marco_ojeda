import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NoticiasService } from 'src/app/backend/noticias.service';
import { Blog } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-editar-noticia',
  templateUrl: './editar-noticia.page.html',
  styleUrls: ['./editar-noticia.page.scss'],
})
export class EditarNoticiaPage implements OnInit {

  id: any;
  public noticia: any = [];

  actualizarNoticia: Blog = {
    titulo: '',
    descripcion: '',
    foto: '',
    id: '',
    fecha: new Date
  }
  

  constructor(public auth: FirestoreAuthService, public noticias: NoticiasService, public toastController: ToastController, public activatedRoute: ActivatedRoute) { 
  }

  async ngOnInit() {
    this.id= this.activatedRoute.snapshot.paramMap.get('id')

    this.noticias.getBlog().subscribe(() => {
      this.noticia = this.noticias.getNoticia(this.id);
    });
  }

  async editar(){
    try {
      await this.noticias.editarNoticia(this.actualizarNoticia.titulo, this.actualizarNoticia.descripcion, this.actualizarNoticia.foto, this.id);
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
