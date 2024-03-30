import { Injectable } from '@angular/core';
import { Blog } from '../model';
import { FirestoreService } from '../service/firestore.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor(public database: FirestoreService) { }

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
    const data = {titulo, descripcion, foto, id:''};
    data['id']= this.database.getId();
    return this.database.creatDoc(data, this.path, this.database.getId());
  }

  editarNoticia(){

  }

  deleteNoticia(){

  }

}
