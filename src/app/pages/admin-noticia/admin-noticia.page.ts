import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/service/firestore.service';
import { Blog } from 'src/app/model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-noticia',
  templateUrl: './admin-noticia.page.html',
  styleUrls: ['./admin-noticia.page.scss'],
})
export class AdminNoticiaPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  vista: 'home' | 'anadir' | 'editar' = 'home';

  noticias: Blog[] = [];

  // Modelo para añadir
  noticia: Blog = this.noticiaVacia();

  // Modelo para editar
  editarNoticia: Blog | null = null;

  // Imagen seleccionada
  imagenSeleccionada: File | null = null;

  readonly PATH = 'Blog';

  constructor(
    public firestore: FirestoreService,
    private storage: AngularFireStorage,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarNoticias();
  }

  // ── Carga ──────────────────────────────────────────────

  cargarNoticias() {
    this.firestore.getCollection<Blog>(this.PATH).subscribe(data => {
      this.noticias = data;
    });
  }

  // ── Navegación entre vistas ────────────────────────────

  irAnadir() {
    this.noticia = this.noticiaVacia();
    this.imagenSeleccionada = null;
    this.vista = 'anadir';
  }

  irEditar(item: Blog) {
    this.editarNoticia = { ...item };
    this.imagenSeleccionada = null;
    this.vista = 'editar';
  }

  volver() {
    this.vista = 'home';
    this.imagenSeleccionada = null;
  }

  // ── Imagen ─────────────────────────────────────────────

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  nuevaImagen(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  mostrarTextoSeleccionarFoto(): string {
    return this.imagenSeleccionada ? this.imagenSeleccionada.name : 'Seleccionar imagen';
  }

  private subirImagen(file: File, id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const path = `noticias/${id}_${file.name}`;
      const ref = this.storage.ref(path);
      const task = this.storage.upload(path, file);

      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const url = await ref.getDownloadURL().toPromise();
            resolve(url);
          } catch (e) {
            reject(e);
          }
        })
      ).subscribe();
    });
  }

  // ── CREATE ─────────────────────────────────────────────

  async guardar() {
    if (!this.noticia.titulo || !this.noticia.contenido) {
      this.mostrarToast('El título y el contenido son obligatorios.');
      return;
    }

    try {
      const id = this.firestore.getId();
      let imagenUrl = '';

      if (this.imagenSeleccionada) {
        imagenUrl = await this.subirImagen(this.imagenSeleccionada, id);
      }

      const nueva: Blog = {
        ...this.noticia,
        id,
        imagenUrl,
      };

      await this.firestore.creatDoc(nueva, this.PATH, id);
      this.mostrarToast('Noticia publicada correctamente.');
      this.volver();
    } catch (error) {
      console.error('Error al guardar la noticia:', error);
      this.mostrarToast('Error al publicar la noticia.');
    }
  }

  // ── UPDATE ─────────────────────────────────────────────

  async editar() {
    if (!this.editarNoticia) return;

    if (!this.editarNoticia.titulo || !this.editarNoticia.contenido) {
      this.mostrarToast('El título y el contenido son obligatorios.');
      return;
    }

    try {
      if (this.imagenSeleccionada) {
        const url = await this.subirImagen(this.imagenSeleccionada, this.editarNoticia.id);
        this.editarNoticia.imagenUrl = url;
      }

      await this.firestore.updateDoc(this.editarNoticia, this.PATH, this.editarNoticia.id);
      this.mostrarToast('Noticia actualizada correctamente.');
      this.volver();
    } catch (error) {
      console.error('Error al editar la noticia:', error);
      this.mostrarToast('Error al actualizar la noticia.');
    }
  }

  // ── DELETE ─────────────────────────────────────────────

  async confirmarDelete(item: Blog) {
    const alert = await this.alertController.create({
      header: 'Eliminar noticia',
      message: `¿Seguro que quieres eliminar "${item.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firestore.deleteDoc(this.PATH, item.id);
              this.mostrarToast('Noticia eliminada correctamente.');
              if (this.vista === 'editar') this.volver();
            } catch (error) {
              console.error('Error al eliminar la noticia:', error);
              this.mostrarToast('Error al eliminar la noticia.');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Helpers ────────────────────────────────────────────

  private noticiaVacia(): Blog {
    return {
      id: '',
      titulo: '',
      resumen: '',
      contenido: '',
      imagenUrl: '',
      categoria: '',
      fecha: '',
    };
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}