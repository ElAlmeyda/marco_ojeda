import { Injectable } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { Producto } from '../model';
import { tap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(public firestore: FirestoreService, public storage: AngularFireStorage) { }

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
    const path ="gs://servicio-4f831.appspot.com/Productos/" + foto;
    foto = path;
    const data = {nombre, descripcion, foto, precio, id:''};
    data['id']= this.firestore.getId();
    return this.firestore.creatDoc(data, this.path, data['id']);
  }

  async editarProducto(nombre: string, descripcion: string, foto: string, precio: number, id:string){

    try {
      const path ="gs://servicio-4f831.appspot.com/Productos/" + foto;
      foto = path;
      const data = {nombre, descripcion, foto, precio, id};
      await this.firestore.updateDoc(data, this.path, id);
      return true;
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      return false; 
    }
  }

  deleteProducto(id: string){
    return this.firestore.deleteDoc(this.path, id);
  }


  public subirImagen(file: any){
    const nombre = file.name;
    const path = "gs://servicio-4f831.appspot.com/Productos/" + nombre;
    return this.firestore.subirImagenes(file, path, nombre);
  }

  public getDownloadUrl(imagenRef: string) {
    const ref = this.storage.refFromURL(imagenRef);
    return ref.getDownloadURL();
  }
}
