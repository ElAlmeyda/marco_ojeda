import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  constructor(private platform: Platform, public firestoreService: FirestoreService) { }
  async obtenerUbicacion(uid: string): Promise<{ latitude: number, longitude: number }> {
    if (this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android')) {
      try {
        const permiso = await Geolocation.requestPermissions();
  
        if (permiso.location === 'granted') {
          const posicion = await Geolocation.getCurrentPosition();
  
          const latitude = posicion.coords.latitude;
          const longitude = posicion.coords.longitude;
  
          const userLocation = {
            latitude,
            longitude,
            timestamp: new Date(),
          };
  
          // Guarda en Firestore
          await this.firestoreService.guardarUbicacion(userLocation, uid);
  
          // Retornar la ubicación obtenida
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
  
  async obtenerCiudad(ubicacion: { latitude: number; longitude: number }): Promise<string> {
    if (!ubicacion || !ubicacion.latitude || !ubicacion.longitude) {
      return "Ubicación no disponible";
    }
  
    const lat = ubicacion.latitude;
    const lon = ubicacion.longitude;
  
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
  
      if (data.address) {
        return data.address.city || data.address.town || data.address.village || "Ciudad no encontrada";
      } else {
        return "Ciudad no encontrada";
      }
    } catch (error) {
      console.error("Error al obtener la ciudad:", error);
      return "Error al obtener la ciudad";
    }
  }

  async obtenerUbicacionPrimero(): Promise<{ latitude: number, longitude: number, ciudad: string }> {
    if (this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android')) {
      try {
        const permiso = await Geolocation.requestPermissions();
  
        if (permiso.location === 'granted') {
          const posicion = await Geolocation.getCurrentPosition();
  
          const latitude = posicion.coords.latitude;
          const longitude = posicion.coords.longitude;
  
          // Obtener la ciudad antes de guardar en Firestore
          const ciudad = await this.obtenerCiudad({ latitude, longitude });
  
          const userLocation = {
            latitude,
            longitude,
            timestamp: new Date(),
          };
  
  
          // Retornar la ubicación obtenida
          return { latitude, longitude, ciudad };
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
