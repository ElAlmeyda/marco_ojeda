import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/backend/tienda.service';
import { Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  favorito=true;
  disfavorito=false;
  favoritos!: Tatuador []
  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };

  segmentoSeleccionado: string = 'tatuadores';
  fotosFavoritas: any[] = []; 

  constructor(public tiendaService: TiendaService, public firestroreAuth: FirestoreAuthService, private router: Router) {
    this.firestroreAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
        await this.obtenerFavoritos();
      } else {
        this.usuario.uid= '';
      }
    });
   }

  ngOnInit() {

  }

  irAlTatuador(fav: any) {
    this.router.navigate(['/tatuador', fav.uid]);
  }

  obtenerFavoritos() {
    this.tiendaService.obtenerFavorito(this.usuario.uid).subscribe(res => {
      this.favoritos = res || [];

      this.favoritos.forEach(tatuador => {
        this.tiendaService.getTatuadorById(tatuador.uid).subscribe(data => {
          this.tiendaService.getAvataresDeTatuador(tatuador.uid).subscribe(avatares => {
            if(avatares)
            tatuador.avatar = avatares; // un array sólo con URLs válidas
          });
        });
      });
    });
  }

  disfav(fav: any) {
    fav.favorito = false;
    this.tiendaService.quitarFavorito(this.usuario.uid, fav.uid); 
  }

  like(fav: any) {
    fav.favorito = true;
    this.tiendaService.agregarFavorito(this.usuario.uid, fav.uid); 
  }
  

}
