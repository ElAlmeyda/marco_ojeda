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
  isLoading =false;
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
    { nombre: 'Anime', imagen: 'assets/estilos/anime.jpg' },
    { nombre: 'Oriental', imagen: 'assets/estilos/oriental.jpg' },
    { nombre: 'Microrealismo', imagen: 'assets/estilos/microrealismo.jpg' },
    { nombre: 'Mahori', imagen: 'assets/estilos/mahori.jpg' },
    { nombre: 'Chicano', imagen: 'assets/estilos/chicano.jpg' },
  ];

  ofertas: Ofertas[] = [];
  todosTatuadores: Tatuador[] = [];
  filtroValoracion: boolean = false;
  filtroCercania: boolean = false;
  mostrarFormulario=false;
  isError=false;

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
      this.isLoading = true;
      this.isError = false;
      // 1. Obtener la ubicación del usuario
      const { latitude, longitude } = await this.ubicacion.obtenerUbicacionPrimero();

      this.latUsuario = latitude;
      this.lonUsuario = longitude;
      await this.cargarTatuadores();

      // Aquí puedes hacer lo que necesites con los tatuadores cercanos (mostrar en UI, etc.)
    } catch (error) {
      console.error('Error al obtener tatuadores cercanos:', error);
      this.isError = true;
    } finally {
      this.isLoading = false;
    }
  }

  reintentarCarga() {
   this.obtenerUbicacionYFiltrarTatuadores();
  }

  async cargarTatuadores() {
    try {
      const data: any[] = await firstValueFrom(this.tiendaService.getTatuadores());

      // Procesar cada tatuador
      const tatuadoresConDistancia = await Promise.all(
        data.map(async (tatuador) => {
          // Calcular distancia
          if (tatuador.latitude && tatuador.longitude && this.latUsuario && this.lonUsuario) {
            tatuador.distancia = this.calcularDistancia(
              this.latUsuario,
              this.lonUsuario,
              tatuador.latitude,
              tatuador.longitude
            );
            console.log("Distancia",tatuador.distancia);
            console.log("Nombre",tatuador.nombreTienda);
          } else {
            tatuador.distancia = null;
          }

          // Obtener la primera foto como promesa
          this.tiendaService.getAvataresDeTatuador(tatuador.uid).subscribe(fotos => {
            tatuador.avatar = fotos ?? ''; 
          });
          return tatuador;
        })
      );

      // Guardar todos los tatuadores
      this.todosTatuadores = tatuadoresConDistancia;

      // Filtrar listas
      this.cerca = this.filtrarTatuadoresCercanos(tatuadoresConDistancia).slice(0, 10);

      // 2️⃣ TOP 10 POR VALORACIÓN (dentro de los cercanos)
      this.valoracion = this.ordenarPorValoracionYDistancia(tatuadoresConDistancia).slice(0, 10);

      // 3️⃣ TOP 10 RECOMENDADOS
      this.recomendado = this.filtrarTatuadoresRecomendados(tatuadoresConDistancia)
        .slice(0, 10);

      console.log('Tatuadores cercanos:', this.cerca);

    } catch (error) {
      console.error('Error cargando tatuadores:', error);
    }
  }

  // Filtrar tatuadores cercanos por ubicación
  filtrarTatuadoresCercanos(tatuadores: any[]) {
    const distanciaMaxima = 50;

    return tatuadores
      .filter(tatuador => tatuador.distancia !== null && tatuador.distancia <= distanciaMaxima)
      .sort((a, b) => a.distancia - b.distancia); // más cercanos primero
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
  ordenarPorValoracionYDistancia(tatuadores: any[]): any[] {
    const copia = [...tatuadores];
    const distanciaMaxima = 50; // km

    // 1️⃣ Filtrar solo los que están dentro del rango
    const dentro = copia.filter(t => t.distancia !== null && t.distancia <= distanciaMaxima);

    // 2️⃣ Ordenar por puntuación y distancia
    return dentro.sort((a, b) => {
      const valorA = Number(a.promedio ?? 0);
      const valorB = Number(b.promedio ?? 0);

      // Sin valoraciones al final
      if (valorA === 0 && valorB !== 0) return 1;
      if (valorB === 0 && valorA !== 0) return -1;

      // Primero por puntuación
      if (valorB !== valorA) {
        return valorB - valorA;
      }

      // Empate → más cercano primero
      return (a.distancia ?? Infinity) - (b.distancia ?? Infinity);
    });
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
      const todos = [...this.cerca, ...this.valoracion, ...this.recomendado];
      this.resultadosBusqueda = todos.filter(
        (t, index, self) =>
        index === self.findIndex(s => s.uid === t.uid)
      );
    }
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}
