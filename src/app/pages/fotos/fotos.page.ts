import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, interval, tap } from 'rxjs';
import { Fotos } from '../../model';
import { FirestoreService } from 'src/app/service/firestore.service';


@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {

  id: string="";

  images: string[] = [];
  currentIndex = 0;

  constructor(private route: ActivatedRoute, public storage: AngularFireStorage, public firestore: FirestoreService) { }

  private path = 'Foto/';
  foto: Fotos[] = [];


  ngOnInit() {


    this.route.paramMap.subscribe(params => {
      // Obtener el valor del parámetro 'id' y convertirlo a un número

      const idFormurl = params.get('id');
      if (idFormurl !== null) {
        this.id = idFormurl.toString();
      }

    });
    this.actualizarImagenes();

    // Cambia la imagen cada 5 segundos (ajusta según sea necesario)
    interval(5000).subscribe(() => this.showNext());

    // Suscribirse a los cambios en los parámetros de la URL
    
  }

  public getDownloadUrl(imgenUrl: string): Promise<string> {
    const ref = this.storage.refFromURL(imgenUrl);
    return ref.getDownloadURL().toPromise();
  }

  async listaFotos() {
    try {
      const photoRequests = this.foto.map(foto => this.getDownloadUrl(foto.imagen));
      const urls = await Promise.all(photoRequests);
      this.images = urls;

    } catch (error) {
      console.error('Error al obtener URLs de descarga:', error);
    }
  }
  


  async actualizarImagenes() {
    this.firestore.getCollection<Fotos>(this.path).subscribe(res => {
      this.foto = res;
      this.planta();
      this.listaFotos();
    });
  }

  planta() {
    return this.foto = this.foto.filter(foto => {
        const plantaValue = typeof foto.planta === 'string' ? foto.planta : String(foto.planta);
        return plantaValue.trim() === this.id.trim();
    });
}

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

}
