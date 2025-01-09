import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, ToastController } from '@ionic/angular';
import { CitaService } from 'src/app/backend/cita.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-prediagnostico-virtual',
  templateUrl: './prediagnostico-virtual.page.html',
  styleUrls: ['./prediagnostico-virtual.page.scss'],
})
export class PrediagnosticoVirtualPage implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild(IonModal) modalRef!: IonModal;

 
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
  terminosAceptados: boolean = false;


  constructor(public cita: CitaService, public toastController: ToastController, private cdr: ChangeDetectorRef, private actionSheetController: ActionSheetController) { }

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

  nuevaImagen(event: any) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      this.urgencia.foto = this.file.name;
      reader.onload = (async (image) => {
        this.imagenSubidaUrl = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  mostrarTextoSeleccionarFoto(): string {
    return this.urgencia.foto ? this.urgencia.foto : 'Seleccionar foto';
  }


  async openFileInput() {
    // Verificar permisos antes de proceder
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.log('Permisos requeridos no concedidos.');
      return; // Si no se tienen los permisos necesarios, termina la función
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Seleccionar de la galería',
          icon: 'images',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          }
        }
      ]
    });

    await actionSheet.present();
    
  }

  

  async takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      if (photo.webPath) {
        this.urgencia.foto = photo.webPath; // La foto tomada se asigna a 'urgencia.foto'
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  // Función para seleccionar una foto desde la galería
  async selectFromGallery() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // Abre la galería
      });
      if (photo.webPath) {
        this.urgencia.foto = photo.webPath; // La foto seleccionada de la galería se asigna a 'urgencia.foto'
      }
    } catch (error) {
      console.error('Error al seleccionar la foto desde la galería:', error);
    }
  }

  async checkPermissions() {
    // Verificar permisos de cámara
    const cameraPermission = await Camera.checkPermissions();
    if (cameraPermission.camera !== 'granted') {
      const request = await Camera.requestPermissions({ permissions: ['camera'] });
      if (request.camera !== 'granted') {
        return false; 
      }
    }
    // Verificar permisos de galería (fotos)
    const photosPermission = await Camera.checkPermissions();
    if (photosPermission.photos !== 'granted') {
      const request = await Camera.requestPermissions({ permissions: ['photos'] });
      if (request.photos !== 'granted') {
        return false; 
      }
    }
    return true;
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
    this.terminosAceptados = false;
  }

  abrirModal() {
    this.modalRef.present();
  }

  cancelarModal() {
    this.modalRef.dismiss();
  }

  formatFecha(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');
    if (valor.length >= 2 && valor.length < 4) { 
      valor = valor.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (valor.length > 4) {
      valor = valor.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }
    this.urgencia.fecha = valor;
    event.target.value = valor;
  }
}
