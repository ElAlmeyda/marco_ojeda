import { Injectable } from '@angular/core';
import { Blog } from '../model';
import { FirestoreService } from '../service/firestore.service';
import { tap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor(public database: FirestoreService, public storage: AngularFireStorage) { }

  private path = 'Noticias/';
  noticias : Blog[] = [];

  getBlog() {
    return this.database.getCollection<Blog>(this.path).pipe(
      tap((res: Blog[]) => {
        this.noticias = res;
      })
    );
  }

  getNoticias(){
    return this.noticias;
  }

  getNoticia(id: string){
    return this.noticias = this.noticias.filter(noticias => noticias.id === id);
  }

  crearNoticia(titulo: string, descripcion: string, foto: string){
    const path ="gs://servicio-4f831.appspot.com/Noticias/" + foto;
    foto = path;
    const data = {titulo, descripcion, foto, id:''};
    data['id']= this.database.getId();
    return this.database.creatDoc(data, this.path, data['id']);
  }

  async editarNoticia(nombre: string, descripcion: string, foto: string, id: string){
    try {
      const path ="gs://servicio-4f831.appspot.com/Noticias/" + foto;
      foto = path;
      const data = {nombre, descripcion, foto, id}
      await this.database.updateDoc(data, this.path, id);
      return true;
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      return false; 
    }
  }

  deleteNoticia(id:string){
    return this.database.deleteDoc(this.path, id);
  }

  public subirImagen(file: any){
    const nombre = file.name;
    const path = "gs://servicio-4f831.appspot.com/Noticias/" + nombre;
    return this.database.subirImagenes(file, path, nombre);
  }

  public getDownloadUrl(imagenRef: string) {
    const ref = this.storage.refFromURL(imagenRef);
    return ref.getDownloadURL();
  }

}
