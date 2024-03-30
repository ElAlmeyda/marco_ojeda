import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Producto } from '../model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(public firestore: FirestoreService) { }

  private path = 'Productos/';
  productos : Producto[] = [];

  getProdCollection() {
    return this.firestore.getCollection<Producto>(this.path).pipe(
      tap((res: Producto[]) => {
        this.productos = res;
      })
    );
  }

  getProductos(){
    return this.productos;
  }

  getProducto(id: string){
    return this.productos = this.productos.filter(productos => productos.id === id);
  }


  crearProducto(nombre: string, descripcion: string, foto: string, precio: number){
    const data = {nombre, descripcion, foto, precio, id:''};
    data['id']= this.firestore.getId();
    return this.firestore.creatDoc(data, this.path, data['id']);
  }

  editarProducto(nombre: string, descripcion: string, foto: string, precio: number, id:string){
    const data = {nombre, descripcion, foto, precio, id};
    return this.firestore.updateDoc(data, this.path, id);
  }

  deleteProducto(id: string){
    return this.firestore.deleteDoc(this.path, id);
  }
}
