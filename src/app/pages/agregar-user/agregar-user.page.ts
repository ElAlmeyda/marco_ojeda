import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Empleado } from 'src/app/model';

@Component({
  selector: 'app-agregar-user',
  templateUrl: './agregar-user.page.html',
  styleUrls: ['./agregar-user.page.scss'],
})
export class AgregarUserPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;

  empleado: Empleado = {
    nombre: '',
    descripcion: '',
    foto: '',
    tipo: '',
    id: ''
  };

  imagenSubidaUrl ='';

  file: any;

  constructor(public empleados: EquipoServiceService, public toastController: ToastController) { }

  ngOnInit() {
  }

  async guardar(){
    try {
      await this.empleados.crearEmpleado(this.empleado.nombre, this.empleado.descripcion, this.file.name, this.empleado.tipo);
      await this.empleados.subirImagen(this.file);
      // Si no se ha lanzado ninguna excepción, significa que se ha creado el empleado correctamente
      this.mostrarToast("Empleado creado correctamente");
      this.initEmpleado();
    } catch (error) {
      console.error("Error al crear el empleado:", error);
      this.mostrarToast("Error al crear el empleado");
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  nuevaImagen(event:any) {
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.empleado.foto = this.file.name;
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
    return this.empleado.foto ? this.empleado.foto : 'Seleccionar foto';
  }

  initEmpleado(){
    this.empleado = {
      nombre: '',
      descripcion: '',
      foto: '',
      tipo: '',
      id: ''
    };
  
  }

}
