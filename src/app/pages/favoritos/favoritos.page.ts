import { Component, OnInit } from '@angular/core';
import { Tienda, Usuario } from 'src/app/model';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  favorito=true;
  disfavorito=false;

  favoritos: Tienda [] = [
     {
    id: '1',
    nombre: 'Panadería La Estrella',
    descripcion: 'Deliciosos panes y pasteles artesanales.',
    foto: 'assets/tiendas/panaderia.jpg',
    precio: 0,
    favorito: true
  },
  {
    id: '2',
    nombre: 'Cafetería Central',
    foto: 'assets/tiendas/cafeteria.jpg',
    descripcion: 'Deliciosos panes y pasteles artesanales.',
    precio: 0,
    favorito: true

  },
  {
    id: '3',
    nombre: 'Tienda Orgánica',
    descripcion: 'Productos ecológicos y saludables.',
    foto: 'assets/tiendas/organica.jpg',
    precio: 0,
    favorito: true

  },
  ];
  usuario!: Usuario

  constructor() { }

  ngOnInit() {

  }

  disfav(fav: any){
    fav.favorito = false;
  }

  like(fav: any){
    fav.favorito = true;
  }

}
