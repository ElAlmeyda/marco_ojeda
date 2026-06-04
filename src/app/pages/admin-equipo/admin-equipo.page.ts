import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Empleado } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-equipo',
  templateUrl: './admin-equipo.page.html',
  styleUrls: ['./admin-equipo.page.scss'],
})
export class AdminEquipoPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  vista: 'home' | 'anadir' | 'editar' = 'home';

  equipo: Empleado[] = [];

  // Modelo para añadir
  empleado: Empleado = this.empleadoVacio();

  // Modelo para editar
  editarEmpleado: Empleado | null = null;

  // Imagen seleccionada
  imagenSeleccionada: File | null = null;

  readonly PATH = 'Equipo';

  constructor(
    public firestore: FirestoreService,
    private storage: AngularFireStorage,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarEquipo();
  }

  // ── Carga ──────────────────────────────────────────────

  cargarEquipo() {
    this.firestore.getCollection<Empleado>(this.PATH).subscribe(data => {
      this.equipo = data;
    });
  }

  // ── Navegación entre vistas ────────────────────────────

  irAnadir() {
    this.empleado = this.empleadoVacio();
    this.imagenSeleccionada = null;
    this.vista = 'anadir';
  }

  irEditar(item: Empleado) {
    this.editarEmpleado = { ...item };
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
    return this.imagenSeleccionada ? this.imagenSeleccionada.name : 'Seleccionar foto';
  }

  private subirImagen(file: File, id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const path = `equipo/${id}_${file.name}`;
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
    if (!this.empleado.nombre) {
      this.mostrarToast('El nombre del empleado es obligatorio.');
      return;
    }

    try {
      const id = this.firestore.getId();
      let imagenUrl = '';

      if (this.imagenSeleccionada) {
        imagenUrl = await this.subirImagen(this.imagenSeleccionada, id);
      }

      const nuevo: Empleado = {
        ...this.empleado,
        id,
        imagenUrl,
      };

      await this.firestore.creatDoc(nuevo, this.PATH, id);
      this.mostrarToast('Empleado guardado correctamente.');
      this.volver();
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
      this.mostrarToast('Error al guardar el empleado.');
    }
  }

  // ── UPDATE ─────────────────────────────────────────────

  async editar() {
    if (!this.editarEmpleado) return;

    if (!this.editarEmpleado.nombre) {
      this.mostrarToast('El nombre del empleado es obligatorio.');
      return;
    }

    try {
      if (this.imagenSeleccionada) {
        const url = await this.subirImagen(this.imagenSeleccionada, this.editarEmpleado.id);
        this.editarEmpleado.imagenUrl = url;
      }

      await this.firestore.updateDoc(this.editarEmpleado, this.PATH, this.editarEmpleado.id);
      this.mostrarToast('Empleado actualizado correctamente.');
      this.volver();
    } catch (error) {
      console.error('Error al editar el empleado:', error);
      this.mostrarToast('Error al actualizar el empleado.');
    }
  }

  // ── DELETE ─────────────────────────────────────────────

  async confirmarDelete(item: Empleado) {
    const alert = await this.alertController.create({
      header: 'Eliminar empleado',
      message: `¿Seguro que quieres eliminar a "${item.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firestore.deleteDoc(this.PATH, item.id);
              this.mostrarToast('Empleado eliminado correctamente.');
              if (this.vista === 'editar') this.volver();
            } catch (error) {
              console.error('Error al eliminar el empleado:', error);
              this.mostrarToast('Error al eliminar el empleado.');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Helpers ────────────────────────────────────────────

  private empleadoVacio(): Empleado {
    return {
      id: '',
      nombre: '',
      descripcion: '',
      tipo: '',
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