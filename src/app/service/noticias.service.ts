import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor() { }

  public noticia= [
    {
      id: 0,
      titulo: 'Enjuague',
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      informacion: 'Lorem ipsum '
    },
    {
      id: 1,
      titulo: 'Cepillo de dientes',
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      informacion: 'Lorem ipsum '
    },
    {
      id: 2,
      titulo: 'Brackets',
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      informacion: 'Lorem ipsum '
    },
    {
      id: 3,
      titulo: 'Implanties',
      imagen: ['../../assets/icon/o_1glaaj6u81utcgl26hqrpg1sbca.jpg'],
      informacion: 'Lorem ipsum '
    }
  ];

  obtenerListaDeNoticia() {
    return this.noticia;
  }

  obtenerNoticia(ruta: any){
    const idBuscado = parseInt(ruta, 10);
    let producto = this.noticia.find(noticia => noticia.id === idBuscado);
    return producto ? [producto] : [];
  }
}
