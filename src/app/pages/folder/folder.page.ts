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
  todosTatuadores: Tatuador[] = [];
  filtroValoracion: boolean = false;
  filtroCercania: boolean = false;
  mostrarFormulario=false;
  isError=false;
  isLoading= false;

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
      this.isError=false;
      this.isLoading=true;
      const { latitude, longitude } = await this.ubicacion.obtenerUbicacionPrimero();

      this.latUsuario = latitude;
      this.lonUsuario = longitude;
      this.cargarTatuadores();

      // Aquí puedes hacer lo que necesites con los tatuadores cercanos (mostrar en UI, etc.)
    } catch (error) {
      console.error('Error al obtener tatuadores cercanos:', error);
    } finally {
      this.isLoading=false;
    }
  }

  reintentarCarga(){
    this.obtenerUbicacionYFiltrarTatuadores();
  }

  cargarTatuadores() {
    this.tiendaService.getTatuadores().subscribe({
      next: (data: any[]) => {
        // Filtrar solo los tatuadores premium
        const tatuadoresPremium = data.filter(tatuador => tatuador.isPremium === true);

        // Calcular distancia respecto a usuario y obtener la primera foto
        const tatuadoresConDistancia = tatuadoresPremium.map(tatuador => {
          if (tatuador.latitud && tatuador.longitud && this.latUsuario && this.lonUsuario) {
            tatuador.distancia = this.calcularDistancia(
              this.latUsuario,
              this.lonUsuario,
              tatuador.latitud,
              tatuador.longitud
            );
          } else {
            tatuador.distancia = null;
          }

          // Obtener la primera foto
          this.tiendaService.getFotosTatuador(tatuador.uid).subscribe(fotos => {
            tatuador.foto = fotos.length > 0 ? [fotos[0]] : [];
            console.log('Foto principal para', tatuador.nombreTienda, tatuador.foto);
          });

          return tatuador;
        });

        // Filtrar listas
        this.cerca = this.filtrarTatuadoresCercanos(tatuadoresConDistancia);
        this.valoracion = this.calcularValoracionesPromedio(this.cerca);
        this.recomendado = this.filtrarTatuadoresRecomendados(tatuadoresConDistancia);
      },
      error: err => console.error("Error al obtener tatuadores:", err)
    });
  }


  // Filtrar tatuadores cercanos por ubicación
  filtrarTatuadoresCercanos(tatuadores: any[]) {
    const distanciaMaxima = 100;
    return tatuadores.filter(tatuador => tatuador.distancia !== null && tatuador.distancia <= distanciaMaxima);
  }

  // Filtrar tatuadores recomendados por el flag `recomendado`
  filtrarTatuadoresRecomendados(tatuadores: any[]) {
    return tatuadores.filter(tatuador => tatuador.isRecomendado === true);
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

      // 2️⃣ Eliminar duplicados por UID usando Map (más eficiente)
      const map = new Map();
      todos.forEach(t => map.set(t.uid, t));

      // 3️⃣ Filtrar por nombreTienda
      this.resultadosBusqueda = Array.from(map.values()).filter(t =>
        t.nombreTienda?.toLowerCase().includes(termino)
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
