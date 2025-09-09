import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { TiendaService } from 'src/app/backend/tienda.service';
import { Ofertas, Tatuador } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { UbicacionService } from 'src/app/service/ubicacion.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  searchTerm: string = '';
  recomendado: Tatuador[] = [];
  cerca: Tatuador []= [];
  resultadosBusqueda: Tatuador[] = [];
  valoracion: Tatuador []= [];
  latUsuario: number = 0;    // Latitud del usuario
  lonUsuario: number = 0;    // Longitud del usuario
  uid=''
  estiloSeleccionado: string | null = null;
  estilos = [
    { nombre: 'Realismo', imagen: 'assets/estilos/realismo.jpg' },
    { nombre: 'Tradicional', imagen: 'assets/estilos/tradicional.jpg' },
    { nombre: 'Neotradicional', imagen: 'assets/estilos/neotradicional.jpg' },
    { nombre: 'Blackwork', imagen: 'assets/estilos/blackwork.jpg' },
    { nombre: 'Fineline', imagen: 'assets/estilos/fineline.jpg' },
    { nombre: 'Geométrico', imagen: 'assets/estilos/geometrico.jpg' },
    { nombre: 'Dotwork', imagen: 'assets/estilos/dotwork.jpg' },
    { nombre: 'Lettering', imagen: 'assets/estilos/lettering.jpg' },
    { nombre: 'Trash Polka', imagen: 'assets/estilos/trashpolka.jpg' },
    { nombre: 'Watercolor', imagen: 'assets/estilos/watercolor.jpg' },
    { nombre: 'Japanese', imagen: 'assets/estilos/japones.jpg' },
    { nombre: 'Tribal', imagen: 'assets/estilos/tribal.jpg' },
    { nombre: 'Surrealismo', imagen: 'assets/estilos/surrealismo.jpg' },
    { nombre: 'Biomecánico', imagen: 'assets/estilos/biomecanico.jpg' },
    { nombre: 'Anime', imagen: 'assets/estilos/anime.jpg' }
  ];
  ofertas: Ofertas[] = [];
  todosTatuadores: any[] = [];
  filtroValoracion: boolean = false;
  filtroCercania: boolean = false;
  mostrarFormulario=false;

  constructor(public tiendaService: TiendaService, public firestroreAuth: FirestoreAuthService, public ubicacion: UbicacionService, public firestore: FirestoreService) {
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
    this.firestore.getTodosLosAnuncios().subscribe(data => {
      this.ofertas = data;
      console.log("Todos los anuncios:", this.ofertas);
    });
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
            console.log("Evaluando tatuador:", tatuador.nombreTienda);

            // Geocodificación si hace falta
            if ((!tatuador.latitud || !tatuador.longitud || tatuador.latitud === 0 || tatuador.longitud === 0) && tatuador.ciudad) {
              const resultado = await this.geocodeDireccion(tatuador.ciudad);
              if (resultado) {
                tatuador.latitud = resultado.lat;
                tatuador.longitud = resultado.lng;
              }
            }

            // Calcular distancia respecto a usuario (solo si tenemos coordenadas)
            if (tatuador.latitud && tatuador.longitud && this.latUsuario && this.lonUsuario) {
              tatuador.distancia = this.calcularDistancia(
                this.latUsuario,
                this.lonUsuario,
                tatuador.latitud,
                tatuador.longitud
              );
            } else {
              tatuador.distancia = null; // si no hay coordenadas
            }

            // Obtener fotos desde Storage
            this.tiendaService.getFotosTatuador(tatuador.uid).subscribe(fotos => {
              tatuador.foto = fotos;
              console.log('Fotos cargadas para', tatuador.nombreTienda, fotos);
            });

            return tatuador;
          })
        );

        // Asignar a tus listas
        this.cerca = this.filtrarTatuadoresCercanos(tatuadoresConUbicacion);
        this.valoracion = this.calcularValoracionesPromedio(this.cerca);
        this.recomendado = this.filtrarTatuadoresRecomendados(tatuadoresConUbicacion);

        console.log("Cerca", this.cerca);
        console.log("Valoracion", this.valoracion);
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
      // 1️⃣ Unir los tres arrays
      const todos = [...this.cerca, ...this.valoracion, ...this.recomendado];

      // 2️⃣ Eliminar duplicados por UID
      const unicos = todos.filter(
        (t, index, self) =>
          index === self.findIndex(s => s.uid === t.uid)
      );

      // 3️⃣ Filtrar por nombreTienda
      this.resultadosBusqueda = unicos.filter(tatuador =>
        tatuador.nombreTienda?.toLowerCase().includes(termino)
      );
    } else {
      this.cargarTatuadores();
    }
  }

  seleccionarEstilo(estilo: any) {
    console.log("Estilo", estilo.nombre);
    this.estiloSeleccionado = this.estiloSeleccionado === estilo.nombre ? null : estilo.nombre;
    this.buscarEstilos();
  }
  
  buscarEstilos() {
    if (this.estiloSeleccionado) {
      // 1️⃣ Unir los tres arrays
      const todos = [...this.cerca, ...this.valoracion, ...this.recomendado];

      // 2️⃣ Filtrar por estilo
      const filtradosPorEstilo = todos.filter(t =>
        t.estilos?.some((e: string) => e === this.estiloSeleccionado)
      );

      // 3️⃣ Eliminar duplicados por UID
      this.resultadosBusqueda = filtradosPorEstilo.filter(
        (t, index, self) =>
          index === self.findIndex(s => s.uid === t.uid)
      );

    } else {
      // Si no hay estilo seleccionado, mostrar todos
      this.resultadosBusqueda = this.todosTatuadores;
    }
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}
