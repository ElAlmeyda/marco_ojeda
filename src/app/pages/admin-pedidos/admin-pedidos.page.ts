import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Pedido } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.page.html',
  styleUrls: ['./admin-pedidos.page.scss'],
})
export class AdminPedidosPage implements OnInit {

  pedidos: Pedido[] = [];
  vista: 'home' | 'detalle' = 'home';
  pedidoSeleccionado: Pedido | null = null;

  // Filtro activo
  filtroEstado: string = 'todos';

  readonly ESTADOS = ['pendiente', 'aceptado', 'enviado', 'completado', 'cancelado'];

  constructor(
    public firestore: FirestoreService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getPedidos();
  }

  // ── Carga ──────────────────────────────────────────────

  getPedidos() {
    this.firestore.getUserPedidos().subscribe((pedidos) => {
      this.pedidos = pedidos;
    });
  }

  get pedidosFiltrados(): Pedido[] {
    if (this.filtroEstado === 'todos') return this.pedidos;
    return this.pedidos.filter(p => p.estado === this.filtroEstado);
  }

  // ── Navegación ─────────────────────────────────────────

  verDetalle(pedido: Pedido) {
    this.pedidoSeleccionado = { ...pedido };
    this.vista = 'detalle';
  }

  volver() {
    this.vista = 'home';
    this.pedidoSeleccionado = null;
  }

  // ── UPDATE estado ──────────────────────────────────────

  async cambiarEstado(pedido: Pedido, nuevoEstado: string) {
    try {
      // getUserPedidos usa collectionGroup('Carrito')
      // El path real es: usuarios/{uid}/Carrito/{id}
      // Necesitamos el path completo; si tu modelo Pedido guarda 'path', úsalo.
      // Si solo tienes el id, ajusta el path según tu estructura en Firestore.
      await this.firestore.updateDoc({ estado: nuevoEstado }, `usuarios/${pedido.clienteId}/Carrito`, pedido.id);
      pedido.estado = nuevoEstado;
      if (this.pedidoSeleccionado?.id === pedido.id) {
        this.pedidoSeleccionado.estado = nuevoEstado;
      }
      this.mostrarToast(`Estado actualizado a "${nuevoEstado}".`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      this.mostrarToast('Error al actualizar el estado.');
    }
  }

  // ── DELETE ─────────────────────────────────────────────

  async confirmarDelete(pedido: Pedido) {
    const alert = await this.alertController.create({
      header: 'Eliminar pedido',
      message: `¿Seguro que quieres eliminar el pedido de "${pedido.cliente?.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firestore.deleteDoc(`usuarios/${pedido.clienteId}/Carrito`, pedido.id);
              this.mostrarToast('Pedido eliminado correctamente.');
              if (this.vista === 'detalle') this.volver();
            } catch (error) {
              console.error('Error al eliminar pedido:', error);
              this.mostrarToast('Error al eliminar el pedido.');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Helpers ────────────────────────────────────────────

  badgeColor(estado: string): string {
    const map: Record<string, string> = {
      pendiente:  'warning',
      aceptado:   'primary',
      enviado:    'tertiary',
      completado: 'success',
      cancelado:  'danger',
    };
    return map[estado] ?? 'medium';
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