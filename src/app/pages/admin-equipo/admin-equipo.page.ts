import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Empleado } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-equipo',
  templateUrl: './admin-equipo.page.html',
  styleUrls: ['./admin-equipo.page.scss'],
})
export class AdminEquipoPage implements OnInit {

  constructor(public empleado: EquipoServiceService, public firestore : FirestoreService, public toastController: ToastController, public alertController: AlertController) { }

  equipo: Empleado[]=[];

  ngOnInit() {
    this.empleado.getEquipo().subscribe(() => {
      this.equipo = this.empleado.getEmpleados();
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
              await this.empleado.deleteEmpleado(idEmpleado);
              this.mostrarToast("Empleado eliminado correctamente");
            } catch (error) {
              console.error("Error al crear el empleado:", error);
              this.mostrarToast("Error al crear el empleado");
            }finally {
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
