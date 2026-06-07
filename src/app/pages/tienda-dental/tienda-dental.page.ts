import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/service/firestore.service';
import { CarritoService } from 'src/app/backend/carrito.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-tienda-dental',
  templateUrl: './tienda-dental.page.html',
  styleUrls: ['./tienda-dental.page.scss'],
})
export class TiendaDentalPage implements OnInit {

  productoSeleccionado: Producto | null = null;
  store: Producto[] = [];
  productosFiltrados: Producto[] = [];
  searchTerm: string = '';

  readonly PATH = 'Productos';

  get cartCount(): number {
    return this.carritoService.getProductos().length;
  }

  get totalProductos(): number {
    return this.store.length;
  }

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    public firestore: FirestoreService,
    private carritoService: CarritoService,
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.firestore.getCollection<Producto>(this.PATH).subscribe(data => {
      this.store = data;
      this.productosFiltrados = [...this.store];
    });
  }

  filtrarProductos() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.productosFiltrados = [...this.store];
      return;
    }
    this.productosFiltrados = this.store.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term) ||
      (p.categoria || '').toLowerCase().includes(term)
    );
  }

  verDetalle(producto: Producto) {
    this.productoSeleccionado = producto;
    const content = document.querySelector('ion-content');
    if (content) (content as any).scrollToTop(300);
  }

  volverLista() {
    this.productoSeleccionado = null;
    const content = document.querySelector('ion-content');
    if (content) (content as any).scrollToTop(300);
  }

  async anadirCarrito(producto: Producto) {
    this.carritoService.agregarAlCarrito(producto);

    const toast = await this.toastCtrl.create({
      message: `✓ ${producto.nombre} añadido al carrito`,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  irCarrito() {
    this.router.navigate(['/carrito']);
  }

  cargarMas(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}