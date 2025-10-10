import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TiendaService } from 'src/app/backend/tienda.service';
import { Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  uid='';

  usuario: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
  };
  map: any;
  tatuadores !: Tatuador[]
  tatuadorSeleccionado: Tatuador | null = null;
  imagenCargada: any;
  latUsuario: number = 0;
  lonUsuario: number = 0;

  constructor(private navCtrl: NavController, public firestroreAuth: FirestoreAuthService, public tiendaService: TiendaService, private zone: NgZone) {
     this.firestroreAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
      } else {
        this.usuario.uid= '';
      }
    });
   }

  ngOnInit() {
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolvemos
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }

      // Creamos el script y lo cargamos
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD56x_KQnlq6lRZE_KgIw_pUKnNg1w4bi4'; // Reemplaza con tu API Key
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = (error) => {
        console.error('Error cargando Google Maps:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  // Método para inicializar el mapa
  async ngAfterViewInit() {
    try {
      await this.loadGoogleMaps(); // Esperamos que cargue la API de Google Maps

      // Obtenemos la ubicación del usuario con alta precisión
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });
      this.latUsuario = position.coords.latitude;
      this.lonUsuario = position.coords.longitude;

      // Crear el mapa centrado en la ubicación del usuario
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: this.latUsuario, lng: this.lonUsuario },
        zoom: 14,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // ✅ Añadir marcador de tu ubicación con ícono azul
      const tuUbicacionMarker = new google.maps.Marker({
        position: { lat: this.latUsuario, lng: this.lonUsuario },
        map: this.map,
        title: 'Tu ubicación',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(40, 40) // Opcional: tamaño del ícono
        }
      });

      // Obtener y mostrar los tatuadores
      // Obtener y mostrar los tatuadores
      this.tiendaService.getTatuadores().subscribe(tatuadores => {

        // Filtrar solo los tatuadores premium
        const tatuadoresPremium = tatuadores.filter(t => t.isPremium === true);

        tatuadoresPremium.forEach(async tatuador => {
          if (tatuador.ciudad) {
            const coords = await this.geocodeDireccion(tatuador.ciudad);
            if (coords) {
              // Guardar latitud, longitud y distancia usando cast a any
              (tatuador as any).latitud = coords.lat;
              (tatuador as any).longitud = coords.lng;

              if (this.latUsuario && this.lonUsuario) {
                (tatuador as any).distancia = this.calcularDistancia(
                  this.latUsuario,
                  this.lonUsuario,
                  coords.lat,
                  coords.lng
                );
              } else {
                (tatuador as any).distancia = null;
              }

              // Crear marcador en el mapa
              const marker = new google.maps.Marker({
                position: coords,
                map: this.map,
                title: tatuador.nombreTienda || 'Tatuador',
                icon: {
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new google.maps.Size(35, 35)
                }
              });

              marker.addListener('click', () => {
                this.zone.run(() => {
                  this.tatuadorSeleccionado = tatuador;
                });
              });

              // Cargar fotos
              this.tiendaService.getFotosTatuador(tatuador.uid).subscribe(fotos => {
                tatuador.foto = fotos;
              });
            }
          }
        });
      });
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  // Método para geocodificar las direcciones de los tatuadores
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

  volverAtras() {
    this.navCtrl.back(); // Vuelve a la página anterior
  }


  cargarMapa() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: userLocation,
        zoom: 13,
        disableDefaultUI: true,
        styles: [{ featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] }]
      });

      // marcador del usuario
      new google.maps.Marker({
        position: userLocation,
        map,
        title: "Tu ubicación",
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

      // geocodifica y marca los tatuadores
      for (const tatuador of this.tatuadores) {
        if (tatuador.ciudad) {
          const coords = await this.geocodeDireccion(tatuador.ciudad);
          if (coords) {
            new google.maps.Marker({
              position: coords,
              map,
              title: tatuador.nombre,
              icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
          }
        }
      }
    });
  }

  mostrarInfoTatuador(tatuador: Tatuador) {
    this.imagenCargada = false; // resetear para que aparezca skeleton
    this.tatuadorSeleccionado = tatuador;
  }

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const radioTierra = 6371; // km
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);

    console.log("📍 Usuario:", lat1, lon1);
    console.log("📍 Tatuador:", lat2, lon2);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log("📏 Distancia calculada (km):", c);

    return radioTierra * c;
  }

  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }


}
