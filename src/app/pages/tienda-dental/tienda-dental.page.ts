import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';

@Component({
  selector: 'app-tienda-dental',
  templateUrl: './tienda-dental.page.html',
  styleUrls: ['./tienda-dental.page.scss'],
  providers:[]
})
export class TiendaDentalPage implements OnInit {

  public store: any = [];
  public searchTerm: string = '';

  constructor(public productos: ProductoService) {
   }

  ngOnInit() {
    this.productos.getProdCollection().subscribe(() =>{
      this.store = this.productos.getProductos();
      this.actualizarImagenes(this.store);
    });
  }


  async actualizarImagenes(prod: any[]) {
    for (const prodFoto of prod) {
      if (prodFoto.foto) {
        try {
          const url = await this.productos.getDownloadUrl(prodFoto.foto).subscribe(
            (url: string) => {
              prodFoto.imagenUrl = url;
            }
          );
          prodFoto.imagenUrl = url;
        } catch (error) {
          console.error('Error al obtener URL de descarga:', error);
        }
      }
    }
  }

  buscarProductos() {
    if (this.searchTerm.trim() !== '') {
      this.store = this.store.filter((item: Producto) => {
        return item.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    } else {
      // Si el campo de búsqueda está vacío, restaurar la lista completa
      this.productos.getProdCollection().subscribe(() => {
        this.store = this.productos.getProductos();
        this.actualizarImagenes(this.store);
      });
    }
  }

}
