import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CitaService } from 'src/app/backend/cita.service';
import { Cita, Urgencia } from 'src/app/model';

@Component({
  selector: 'app-prediagnostico-virtual',
  templateUrl: './prediagnostico-virtual.page.html',
  styleUrls: ['./prediagnostico-virtual.page.scss'],
})
export class PrediagnosticoVirtualPage implements OnInit {

 
  urgencia  = {
    nombre: '',
    movil: '',
    fecha: '',
    enfermedad: '',
    medicamento: '',
    embarazo: false,
    alergias: '',
    sintomas:'',
    foto: '',
    id: '',
  }

  constructor(public cita: CitaService, public toastController: ToastController) { }

  ngOnInit() {
  }

  async aceptar(){
    try {
      await this.cita.guardarUrgencia(this.urgencia);
      this.mostrarToast("Su urgencia ha sido enviada correctamente");
    } catch (error) {
      this.mostrarToast("Error al enviar el urgencia");
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
