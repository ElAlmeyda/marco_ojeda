import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
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
  R = 6371;
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
    });
  }
  
  async obtenerUbicacionYFiltrarTatuadores() {
    try {
      // 1. Obtener la ubicación del usuario
      const { latitude, longitude } = await this.ubicacion.obtenerUbicacionPrimero();

      this.latUsuario = latitude;
      this.lonUsuario = longitude;
      await this.cargarTatuadores();

      // Aquí puedes hacer lo que necesites con los tatuadores cercanos (mostrar en UI, etc.)
    } catch (error) {
      console.error('Error al obtener tatuadores cercanos:', error);
    }
  }

  async cargarTatuadores() {
    try {
      const data: any[] = await firstValueFrom(this.tiendaService.getTatuadores());

      // Filtrar solo los tatuadores premium
      const tatuadoresPremium = data.filter(t => t.isPremium);


      // Procesar cada tatuador
      const tatuadoresConDistancia = await Promise.all(
        tatuadoresPremium.map(async (tatuador) => {
          // Calcular distancia
          if (tatuador.latitude && tatuador.longitude && this.latUsuario && this.lonUsuario) {
            tatuador.distancia = this.calcularDistancia(
              this.latUsuario,
              this.lonUsuario,
              tatuador.latitude,
              tatuador.longitude
            );
            console.log("Distancia",tatuador.distancia);
          } else {
            tatuador.distancia = null;
          }

          // Obtener la primera foto como promesa
          const fotos: any[] = await firstValueFrom(this.tiendaService.getFotosTatuador(tatuador.uid));
          tatuador.foto = fotos.length > 0 ? [fotos[0]] : [];

          return tatuador;
        })
      );

      // Guardar todos los tatuadores
      this.todosTatuadores = tatuadoresConDistancia;

      // Filtrar listas
      this.cerca = this.filtrarTatuadoresCercanos(tatuadoresConDistancia);
      this.valoracion = this.calcularValoracionesPromedio(this.cerca);
      this.recomendado = this.filtrarTatuadoresRecomendados(tatuadoresConDistancia);

      console.log('Tatuadores cercanos:', this.cerca);

    } catch (error) {
      console.error('Error cargando tatuadores:', error);
    }
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

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
      return -1; // Ubicación no disponible
    }
    console.log("📍 Usuario:", lat1, lon1);
    console.log("📍 Tatuador:", lat2, lon2);

    const radLat1 = lat1 * (Math.PI / 180);
    const radLat2 = lat2 * (Math.PI / 180);
    const deltaLat = (lat2 - lat1) * (Math.PI / 180);
    const deltaLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = this.R * c; // Asegúrate de que this.R = 6371 para km
    console.log("📏 Distancia calculada (km):", distancia);
    return distancia;
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
