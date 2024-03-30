import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Empleado } from 'src/app/model';

@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.page.html',
  styleUrls: ['./editar-user.page.scss'],
})
export class EditarUserPage implements OnInit {

  id:any;
  public empleado: any = [];


  editarEmpleado: Empleado= {
    nombre: '',
    descripcion: '',
    foto: '',
    tipo: '',
    id: ''
  }
  constructor(public equipo: EquipoServiceService,
    private activatedRoute: ActivatedRoute, public toastController: ToastController) { }

  async ngOnInit() {
    this.id= this.activatedRoute.snapshot.paramMap.get('id')

    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getEspecialista(this.id);
      console.log(this.empleado);
    });
  }

  async editar(){
    try {
      await this.equipo.actualizarEmpleado(this.editarEmpleado.nombre, this.editarEmpleado.descripcion, this.editarEmpleado.foto, this.editarEmpleado.tipo, this.id);
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
