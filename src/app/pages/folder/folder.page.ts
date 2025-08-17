import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { TiendaService } from 'src/app/backend/tienda.service';
import { Tatuador } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { UbicacionService } from 'src/app/service/ubicacion.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  searchTerm: string = '';
  recomendado: Tatuador[] = [];
  cerca: Tatuador []= [];
  valoracion: Tatuador []= [];
  latUsuario: number = 0;    // Latitud del usuario
  lonUsuario: number = 0;    // Longitud del usuario
  uid=''
  
  constructor(public tiendaService: TiendaService, public firestroreAuth: FirestoreAuthService, public ubicacion: UbicacionService) {
    this.firestroreAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
      } else {
        this.uid= '';
      }
    });
    this.obtenerUbicacionYFiltrarTatuadores();
  }

  ngOnInit() {
  }

  async obtenerUbicacionYFiltrarTatuadores() {
    try {
      // 1. Obtener la ubicación del usuario
      const { latitude, longitude } = await this.ubicacion.obtenerUbicacionPrimero();

      this.latUsuario = latitude;
      this.lonUsuario = longitude;
      this.cargarTatuadores();

      // Aquí puedes hacer lo que necesites con los tatuadores cercanos (mostrar en UI, etc.)
    } catch (error) {
      console.error('Error al obtener tatuadores cercanos:', error);
    }
  }

  cargarTatuadores() {
    this.tiendaService.getTatuadores().subscribe({
      next: async (data: any[]) => {
        console.log("Tatuadores recibidos:", data);

        const tatuadoresConUbicacion = await Promise.all(
          data.map(async tatuador => {
            console.log("Evaluando tatuador:", tatuador.nombreTienda, "Lat:", tatuador.latitud, "Lon:", tatuador.longitud);

            if (
              (!tatuador.latitud || !tatuador.longitud ||
              tatuador.latitud === 0 || tatuador.longitud === 0) &&
              tatuador.ciudad
            ) {
              console.log("Geocodificando tatuador:", tatuador.nombreTienda);
              const resultado = await this.geocodeDireccion(tatuador.ciudad);
              if (resultado) {
                tatuador.latitud = resultado.lat;
                tatuador.longitud = resultado.lng;
              }
            } else if (!tatuador.ciudad) {
              console.warn("Tatuador sin dirección:", tatuador.nombreTienda);
            }

            return tatuador;
          })
        );

        this.cerca = this.filtrarTatuadoresCercanos(tatuadoresConUbicacion);
        console.log("Cerca", this.cerca);

        this.valoracion = this.calcularValoracionesPromedio(this.cerca);
        console.log("Valoracion", this.valoracion);

        this.recomendado = this.filtrarTatuadoresRecomendados(tatuadoresConUbicacion);
        console.log("Recomendado", this.recomendado);
      },
      error: err => console.error("Error al obtener tatuadores:", err)
    });
  }


  // Filtrar tatuadores cercanos por ubicación
  filtrarTatuadoresCercanos(tatuadores: any[]) {
    const distanciaMaxima = 100; // Distancia máxima en km (puedes ajustarla)

    return tatuadores.filter(tatuador => {
      const latTatuador = tatuador.latitud;
      const lonTatuador = tatuador.longitud;

      const distancia = this.calcularDistancia(this.latUsuario, this.lonUsuario, latTatuador, lonTatuador);

      // Filtra tatuadores que están dentro de la distancia máxima
      return distancia <= distanciaMaxima;
    });
  }

  geocodeDireccion(direccion: string): Promise<{ lat: number, lng: number } | null> {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ address: direccion }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error('Error geocodificando dirección:', direccion, status);
          resolve(null);
        }
      });
    });
  }

  // Filtrar tatuadores recomendados por el flag `recomendado`
  filtrarTatuadoresRecomendados(tatuadores: any[]) {
    return tatuadores.filter(tatuador => tatuador.recomendado === true);
  }

  // Método para calcular la distancia entre dos coordenadas geográficas usando la fórmula de Haversine
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros

    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radioTierra * c; // Distancia en kilómetros
  }

  // Convierte grados a radianes
  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Calcular la puntuación promedio de cada tatuador y ordenar por puntuación
  calcularValoracionesPromedio(tatuadores: any[]): any[] {
    // Calcular el promedio de las valoraciones de cada tatuador
    tatuadores.forEach(tatuador => {
      if (tatuador.reseñas && tatuador.reseñas.length > 0) {
        const sumaPuntuaciones = tatuador.reseñas.reduce((total: any, reseña: { puntuacion: any; }) => total + reseña.puntuacion, 0);
        tatuador.puntuacionPromedio = sumaPuntuaciones / tatuador.reseñas.length;
      } else {
        tatuador.puntuacionPromedio = 0; // Si no tiene reseñas, asignar puntuación 0
      }
    });

    // Ordenar los tatuadores por puntuación promedio (de mayor a menor)
    return tatuadores.sort((a, b) => b.puntuacionPromedio - a.puntuacionPromedio);
  }

  buscarTatuador() {
    const termino = this.searchTerm.trim().toLowerCase();

    if (termino !== '') {
      this.recomendado = this.recomendado.filter(tatuador =>
        tatuador.nombreTienda.toLowerCase().includes(termino)
      );
    } else {
      this.tiendaService.getTatuadores().subscribe((data:any) => {
        this.recomendado = data; 
      });
    }
  }


}
