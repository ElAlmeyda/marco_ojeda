import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput: any;
  imagenSubidaUrl ='';
  file: any;

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
      this.actualizarNoticia = this.noticia[0];
    });
  }

  async editar(){

    const check = await this.noticias.editarNoticia(this.actualizarNoticia.titulo, this.actualizarNoticia.descripcion, this.file.name, this.id);
    await this.noticias.subirImagen(this.file);
    if (check) {
      this.mostrarToast("Noticia actualizado correctamente");
    } else {          
      this.mostrarToast("Error al actualizado el noticia");
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

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  nuevaImagen(event:any) {
    console.log(event);
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.noticia.foto = this.file.name;
      reader.onload = (async (image) =>{
        this.imagenSubidaUrl = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  mostrarTextoSeleccionarFoto(): string {
    return this.noticia.foto ? this.noticia.foto : 'Seleccionar foto';
  }

}
