import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-tienda-dental',
  templateUrl: './tienda-dental.page.html',
  styleUrls: ['./tienda-dental.page.scss'],
  providers:[]
})
export class TiendaDentalPage implements OnInit {

  // Estado de la vista
  productoSeleccionado: Producto | null = null;
 
  // Datos
  store: Producto[] = [];
  productosFiltrados: Producto[] = [];
 
  // UI
  searchTerm: string = '';
  cartCount: number = 0;
 
  get totalProductos(): number {
    return this.store.length;
  }
 
  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    // private productosService: ProductosService,
  ) {}
 
  ngOnInit() {
    this.cargarProductos();
  }
 
  // ── Carga de datos ──────────────────────────────────────
 
  cargarProductos() {
    // Sustituye esto por tu llamada real al servicio:
    // this.productosService.getAll().subscribe(data => {
    //   this.store = data;
    //   this.productosFiltrados = [...this.store];
    // });
 
    // Datos de ejemplo:
    this.store = [
      {
        id: "1",
        nombre: 'Pasta Blanqueante Pro',
        precio: 12.90,
        descripcion: 'Fórmula avanzada con carbón activo y fluoruro. Blanquea hasta 5 tonos en 4 semanas de uso continuado. Apta para dientes sensibles.',
        categoria: '',
        imagenUrl: ''
      },
      {
        id: "2",
        nombre: 'Hilo Dental Seda',
        precio: 4.50,
        descripcion: 'Hilo de seda natural con cera de abeja. Deslizamiento suave entre los dientes, apto para encías sensibles.',
        categoria: '',
        imagenUrl: '',
      },
      {
        id: "3",
        nombre: 'Cepillo Eléctrico X3',
        precio: 89.00,
        descripcion: '3 modos de limpieza: suave, estándar e intensivo. Cabezal ultrasónico con 40.000 pulsaciones por minuto. Batería de 2 semanas.',
        categoria: '',
        imagenUrl: '',
      },
      {
        id: "4",
        nombre: 'Enjuague Bucal Premium',
        precio: 8.75,
        descripcion: 'Fórmula libre de alcohol con aceite de árbol de té y menta. Protección 12 horas contra bacterias.',
        categoria: '',
        imagenUrl: '',
      },
    ];
 
    this.productosFiltrados = [...this.store];
  }
 
  cargarMas(event: any) {
    // Lógica de paginación si la necesitas
    setTimeout(() => {
      event.target.complete();
      // Si no hay más datos: event.target.disabled = true;
    }, 500);
  }
 
  // ── Navegación entre vistas ─────────────────────────────
 
  verDetalle(producto: Producto) {
    this.productoSeleccionado = producto;
    // Scroll al tope al abrir detalle
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  volverLista() {
    this.productoSeleccionado = null;
  }
 
  // ── Carrito ─────────────────────────────────────────────
 
  async anadirCarrito(producto: Producto) {
    this.cartCount++;
 
    const toast = await this.toastCtrl.create({
      message: `✓ ${producto.nombre} añadido al carrito`,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
 
  irCarrito() {
    this.router.navigate(['/carrito']);
  }
 
  // ── Búsqueda ─────────────────────────────────────────────
 
  filtrarProductos() {
    const term = this.searchTerm.toLowerCase().trim();
 
    if (!term) {
      this.productosFiltrados = [...this.store];
      return;
    }
 
    this.productosFiltrados = this.store.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    );
  }

}
