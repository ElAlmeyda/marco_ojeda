import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CitaService } from 'src/app/backend/cita.service';
import { Cita, Urgencia } from 'src/app/model';

@Component({
  selector: 'app-prediagnostico-virtual',
  templateUrl: './prediagnostico-virtual.page.html',
  styleUrls: ['./prediagnostico-virtual.page.scss'],
})
export class PrediagnosticoVirtualPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;

 
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
    imagenUrl: '',
    id: '',
  }
  file: any;
  imagenSubidaUrl ='';



  constructor(public cita: CitaService, public toastController: ToastController) { }

  ngOnInit() {
  }

  async aceptar(){
    try {
      await this.cita.guardarUrgencia(this.urgencia);
      await this.cita.subirImagen(this.file);
      this.mostrarToast("Su urgencia ha sido enviada correctamente");
      this.init();
    } catch (error) {
      this.mostrarToast("Error al enviar el urgencia");
    }
  }

  nuevaImagen(event:any) {
    console.log(event);
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.urgencia.foto = this.file.name;
      reader.onload = (async (image) =>{
        this.imagenSubidaUrl = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  mostrarTextoSeleccionarFoto(): string {
    return this.urgencia.foto ? this.urgencia.foto : 'Seleccionar foto';
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }


  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración del toast en milisegundos
      position: 'bottom' // Posición del toast en la pantalla
    });
    toast.present();
  }

  init(){
    this.urgencia  = {
      nombre: '',
      movil: '',
      fecha: '',
      enfermedad: '',
      medicamento: '',
      embarazo: false,
      alergias: '',
      sintomas:'',
      foto: '',
      imagenUrl: '',
      id: '',
    }
  }
}
