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
  imagenSeleccionada: string | null = null;

  segmentoSeleccionado: string = 'tatuadores';
  fotosFavoritas: any[] = []; 
  imagenCargada: boolean[] = [];
  favoritosUsuario: any[] = [];
  fotosTatuador: { url: string; favorita: boolean }[] = [];

  constructor(public tiendaService: TiendaService, public firestroreAuth: FirestoreAuthService, private router: Router) {
    this.firestroreAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
        await this.obtenerFavoritos();
        await this.obtenerFavoritosFotos();
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

  irAlTatuadorFav(tatuadorId: string) {
    if (tatuadorId && tatuadorId !== 'sinTatuador') {
      this.router.navigate(['/tatuador', tatuadorId]);
    }
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

   obtenerFavoritosFotos() {
    this.tiendaService.obtenerFavoritosFotos(this.usuario.uid).subscribe({
      next: (favoritos) => {
        this.fotosFavoritas = favoritos.map(f => ({
          id: f.id,
          url: f.url,
          tatuadorId: f.tatuadorId,
          favorita: true
        }));
        console.log('📸 Fotos favoritas cargadas:', this.fotosFavoritas);
      },
      error: (err) => console.error('❌ Error al cargar favoritos de fotos', err)
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
  

  async toggleFavoritoFoto(foto: any, event: Event) {
    event.stopPropagation();

    if (!this.usuario.uid) return;

    if (foto.favorita && foto.id) {
      // 🔻 Eliminar de favoritos
      await this.tiendaService.eliminarFavoritoFoto(this.usuario.uid, foto.id);
      foto.favorita = false;
      this.fotosFavoritas = this.fotosFavoritas.filter(f => f.id !== foto.id);
      console.log('🗑️ Foto eliminada de favoritos:', foto.url);
    } else {
      // ❤️ Guardar como favorita
      const nuevoId = await this.tiendaService.guardarFavoritoFoto(
        this.usuario.uid,
        foto.tatuadorId || 'sinTatuador',
        foto.url
      );
      foto.favorita = true;
      foto.id = nuevoId;
      console.log('❤️ Foto guardada como favorita:', foto.url);
    }
  }

  onImgWillLoad(index: number) {
    this.imagenCargada[index] = false;
  }

  onImgDidLoad(index: number) {
    this.imagenCargada[index] = true;
  }

  verImagen(foto: string) {
    this.imagenSeleccionada = foto;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

}
