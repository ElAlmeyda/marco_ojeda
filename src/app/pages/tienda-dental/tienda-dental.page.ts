import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/backend/producto.service';
import { ProductoModule } from 'src/app/module/producto/producto.module';

@Component({
  selector: 'app-tienda-dental',
  templateUrl: './tienda-dental.page.html',
  styleUrls: ['./tienda-dental.page.scss'],
  providers:[ProductoModule]
})
export class TiendaDentalPage implements OnInit {

  public store: any = [];

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

}
