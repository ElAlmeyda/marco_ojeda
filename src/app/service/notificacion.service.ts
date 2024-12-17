
import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  Token,
  PushNotifications,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirestoreAuthService } from './firestore-auth.service';
import { FirestoreService } from './firestore.service';
import { getMessaging, getToken } from 'firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {


  uid= '';
  token= '';

  constructor(
    private platform: Platform,
    private router: Router,
    private firestroreAuth: FirestoreAuthService,
    private firestoreService: FirestoreService
  ) { 
  }

  async inicializar(uid: string) {
    this.uid = uid;
    console.log("Dentro del notificacion", this.uid)
    if (!this.uid) {
      console.error('No se ha obtenido el UID, no se pueden registrar notificaciones');
      return;  // No continúes si el uid está vacío
    }
    if (this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then(result => {
        console.log('Request permissions result: ', result);
        if (result.receive === 'granted') {
          PushNotifications.register();
          this.addListeners();
        } else {
          console.log('Push notifications permission not granted');
        }
      });
    } else if (this.platform.is('pwa') || this.isWebApp()) {
      console.log('Inicializando notificaciones para PWA');
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('Notificaciones Push no soportadas en este navegador');
        return;
      }
    
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.error('Permisos para notificaciones no otorgados');
        return;
      }
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado para PWA:', registration);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array('BPn0jOtvqbcR4wTVViwpU1EuYyeZ_80qB7TjuGCs28L5lakZ9ATJMgG4BEXgfTyLt4l-rmS-RCuvUnrxTXzPMjc')
      });
      console.log('Suscripción para notificaciones Push:', subscription);
    } else {
      console.log('Entorno no compatible con notificaciones push');
    }
  }

  urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  

  isWebApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  async addListeners() {
    if (this.platform.is('capacitor')) {
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Token recibido:', token.value);
        await this.guardarToken(token.value);
      });
    } else if (this.platform.is('pwa') || this.isWebApp()) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array('BPn0jOtvqbcR4wTVViwpU1EuYyeZ_80qB7TjuGCs28L5lakZ9ATJMgG4BEXgfTyLt4l-rmS-RCuvUnrxTXzPMjc')
        });
        const token = JSON.stringify(subscription);
        console.log('Token recibido para PWA:', token);
        await this.guardarToken(token); 
      } catch (error) {
        console.error('Error al suscribirse a notificaciones push:', error);
      }
    }

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('Error on registration: ', error);
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification);
        // Manejo de notificaciones locales
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Notification action performed: ', notification);
        this.router.navigate(['/perfil']);
      }
    );
  }

  async guardarToken(token: string) {
    if (this.uid) {
      try {
        await this.firestoreService.agregarTokens(token, this.uid);  // Guardamos el token en Firestore
        console.log('Token guardado correctamente en Firestore');
      } catch (error) {
        console.error('Error al guardar el token en Firestore:', error);
      }
    }
  }

  async eliminarToken() {
    if (this.uid) {
      try {
        this.obtenerToken();
        await this.firestoreService.eliminarToken(this.uid, this.token);  // Guardamos el token en Firestore
      } catch (error) {
      }
    }
  }  

  async obtenerToken() {
    const messaging = getMessaging();
    try {
      const token = await getToken(messaging, { vapidKey: 'BPn0jOtvqbcR4wTVViwpU1EuYyeZ_80qB7TjuGCs28L5lakZ9ATJMgG4BEXgfTyLt4l-rmS-RCuvUnrxTXzPMjc' });
      if (token) {
        console.log("Token de dispositivo obtenido: ", token);
        // Aquí puedes guardar el token en Firestore o en algún lugar
        this.token = token;  // Guarda el token en una propiedad de tu clase o servicio
      } else {
        console.log("No se pudo obtener el token");
      }
    } catch (error) {
      console.error("Error al obtener el token de FCM:", error);
    }
  }
}
