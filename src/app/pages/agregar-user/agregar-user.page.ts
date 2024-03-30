import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Empleado } from 'src/app/model';

@Component({
  selector: 'app-agregar-user',
  templateUrl: './agregar-user.page.html',
  styleUrls: ['./agregar-user.page.scss'],
})
export class AgregarUserPage implements OnInit {

  empleado: Empleado = {
    nombre: '',
    descripcion: '',
    foto: '',
    tipo: '',
    id: ''
  };

  constructor(public empleados: EquipoServiceService, public toastController: ToastController) { }

  ngOnInit() {
  }

  async guardar(){
    try {
      await this.empleados.crearEmpleado(this.empleado.nombre, this.empleado.descripcion, this.empleado.foto, this.empleado.tipo);
      // Si no se ha lanzado ninguna excepción, significa que se ha creado el empleado correctamente
      this.mostrarToast("Empleado creado correctamente");
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
