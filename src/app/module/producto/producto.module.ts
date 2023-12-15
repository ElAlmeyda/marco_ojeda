import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[]
})
export class ProductoModule {
  public productos= [
    {
      id: 0,
      nombre: 'Enjuague',
      precio: 5,
      cantidad: 0,
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      descripcion: 'Lorem ipsum '
    },
    {
      id: 1,
      nombre: 'Cepillo de dientes',
      precio: 6,
      cantidad: 0,
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      descripcion: 'Lorem ipsum '
    },
    {
      id: 2,
      nombre: 'Brackets',
      precio: 10,
      cantidad: 0,
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      descripcion: 'Lorem ipsum '
    },
    {
      id: 3,
      nombre: 'Implanties',
      precio: 20,
      cantidad: 0,
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      descripcion: 'Lorem ipsum '
    }
  ];

  obtenerListaDeProductos() {
    return this.productos;
  }

  obtenerProducto(ruta: any){
    const idBuscado = parseInt(ruta, 10);
    let producto = this.productos.find(productos => productos.id === idBuscado);
    return producto ? [producto] : [];
  }

  

}
