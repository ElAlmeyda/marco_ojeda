import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { NoticiasService } from 'src/app/backend/noticias.service';
import { Blog } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-noticia',
  templateUrl: './admin-noticia.page.html',
  styleUrls: ['./admin-noticia.page.scss'],
})
export class AdminNoticiaPage implements OnInit {

  constructor(public noticias: NoticiasService, public firestore: FirestoreService, public toastController: ToastController, public alertController: AlertController) { }

  noticia: Blog[]= [];

  ngOnInit() {
    this.noticias.getBlog().subscribe(() => {
      this.noticia = this.noticias.getNoticias();
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
                await this.noticias.deleteNoticia(idEmpleado);
                this.mostrarToast("Noticia eliminado correctamente");
              } catch (error) {
                console.error("Error al eliminar el noticia:", error);
                this.mostrarToast("Error al eliminar el noticia");
              }  finally {
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
