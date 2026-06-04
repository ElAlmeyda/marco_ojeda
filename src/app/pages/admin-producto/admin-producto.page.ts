import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-producto',
  templateUrl: './admin-producto.page.html',
  styleUrls: ['./admin-producto.page.scss'],
})
export class AdminProductoPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  vista: 'home' | 'anadir' | 'editar' = 'home';

  productos: Producto[] = [];

  // Modelo para añadir
  producto: Producto = this.productoVacio();

  // Modelo para editar
  editarProducto: Producto | null = null;

  // Imagen seleccionada
  imagenSeleccionada: File | null = null;

  readonly PATH = 'Productos';

  constructor(
    public firestore: FirestoreService,
    private storage: AngularFireStorage,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  // ── Carga ──────────────────────────────────────────────

  cargarProductos() {
    this.firestore.getCollection<Producto>(this.PATH).subscribe(data => {
      this.productos = data;
    });
  }

  // ── Navegación entre vistas ────────────────────────────

  irAnadir() {
    this.producto = this.productoVacio();
    this.imagenSeleccionada = null;
    this.vista = 'anadir';
  }

  irEditar(item: Producto) {
    this.editarProducto = { ...item };
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
      const path = `productos/${id}_${file.name}`;
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
    if (!this.producto.nombre) {
      this.mostrarToast('El nombre del producto es obligatorio.');
      return;
    }

    try {
      const id = this.firestore.getId();
      let imagenUrl = '';

      if (this.imagenSeleccionada) {
        imagenUrl = await this.subirImagen(this.imagenSeleccionada, id);
      }

      const nuevo: Producto = {
        ...this.producto,
        id,
        imagenUrl,
      };

      await this.firestore.creatDoc(nuevo, this.PATH, id);
      this.mostrarToast('Producto guardado correctamente.');
      this.volver();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      this.mostrarToast('Error al guardar el producto.');
    }
  }

  // ── UPDATE ─────────────────────────────────────────────

  async editar() {
    if (!this.editarProducto) return;

    if (!this.editarProducto.nombre) {
      this.mostrarToast('El nombre del producto es obligatorio.');
      return;
    }

    try {
      if (this.imagenSeleccionada) {
        const url = await this.subirImagen(this.imagenSeleccionada, this.editarProducto.id);
        this.editarProducto.imagenUrl = url;
      }

      await this.firestore.updateDoc(this.editarProducto, this.PATH, this.editarProducto.id);
      this.mostrarToast('Producto actualizado correctamente.');
      this.volver();
    } catch (error) {
      console.error('Error al editar el producto:', error);
      this.mostrarToast('Error al actualizar el producto.');
    }
  }

  // ── DELETE ─────────────────────────────────────────────

  async confirmarDelete(item: Producto) {
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Seguro que quieres eliminar "${item.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firestore.deleteDoc(this.PATH, item.id);
              this.mostrarToast('Producto eliminado correctamente.');
              if (this.vista === 'editar') this.volver();
            } catch (error) {
              console.error('Error al eliminar el producto:', error);
              this.mostrarToast('Error al eliminar el producto.');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Helpers ────────────────────────────────────────────

  private productoVacio(): Producto {
    return {
      id: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      imagenUrl: '',
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