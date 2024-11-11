import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { Empleado } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.page.html',
  styleUrls: ['./editar-user.page.scss'],
})
export class EditarUserPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;

  id:any;
  public empleado: any = [];
  imagenSubidaUrl ='';

  file: any;
  editarEmpleado: Empleado= {
    nombre: '',
    descripcion: '',
    foto: '',
    tipo: '',
    id: ''
  }

  constructor(public equipo: EquipoServiceService, public storage: FirestoreService,
    private activatedRoute: ActivatedRoute, public toastController: ToastController, public navController: NavController) { }

  async ngOnInit() {
    this.id= this.activatedRoute.snapshot.paramMap.get('id')

    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getEspecialista(this.id);
      this.editarEmpleado = this.empleado[0];
    });
  }

  async editar(){
    let fotoSubida = this.editarEmpleado.foto; 
    console.log("Fotosubida despues del let ",fotoSubida);
  
    if (this.file) {
      await this.equipo.subirImagen(this.file);
      fotoSubida = this.file.name; 
    }
  
    const check = await this.equipo.actualizarEmpleado(
      this.editarEmpleado.nombre,
      this.editarEmpleado.descripcion,
      fotoSubida, 
      this.editarEmpleado.tipo,
      this.id
    );
  
    if (check) {
      this.mostrarToast("Empleado actualizado correctamente");
    } else {
      this.mostrarToast("Error al actualizar el empleado");
    }

    this.navController.back();
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  nuevaImagen(event:any) {
    console.log(event);
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.editarEmpleado.foto = this.file.name;
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
    return this.editarEmpleado.foto ? this.editarEmpleado.foto : 'Seleccionar foto';
  }

}
