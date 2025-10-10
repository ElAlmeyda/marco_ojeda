import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  constructor(private platform: Platform, public firestoreService: FirestoreService) { }

  async obtenerUbicacionPrimero(): Promise<{ latitude: number, longitude: number }> {
    if (this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android')) {
      try {
        const permiso = await Geolocation.requestPermissions();

        if (permiso.location === 'granted') {
          // Aumentar timeout a 20 segundos y enableHighAccuracy para mejor precisión
          const posicion = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 20000 // 20 segundos
          });

          const latitude = posicion.coords.latitude;
          const longitude = posicion.coords.longitude;

          return { latitude, longitude };

        } else {
          console.error('Permiso de ubicación denegado');
          throw new Error('Permiso de ubicación denegado');
        }
      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
        throw error;
      }
    } else {
      console.error('Esta plataforma no soporta geolocalización');
      throw new Error('Plataforma no soporta geolocalización');
    }
  }
}
