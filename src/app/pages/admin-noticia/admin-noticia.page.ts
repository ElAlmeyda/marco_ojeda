import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NoticiasService } from 'src/app/backend/noticias.service';
import { Blog } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-noticia',
  templateUrl: './admin-noticia.page.html',
  styleUrls: ['./admin-noticia.page.scss'],
})
export class AdminNoticiaPage implements OnInit {

  constructor(public noticias: NoticiasService, public firestore: FirestoreService, public toastController: ToastController) { }

  noticia: Blog[]= [];

  ngOnInit() {
    this.noticias.getBlog().subscribe(() => {
      this.noticia = this.noticias.getNoticias();
    });
  }

  async delete(empleadoDelete: any){
    try {
      const idEmpleado = empleadoDelete.id;
      await this.noticias.deleteNoticia(idEmpleado);
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
