import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  Token,
  PushNotifications,
} from '@capacitor/push-notifications';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirestoreAuthService } from './firestore-auth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(
    private platform: Platform,
    private router: Router,
    private firestroreAuth: FirestoreAuthService,
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) { 
    this.stateAuth();
  }

  // Inicialización de las notificaciones push
  inicializar() {
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
    } else {
      console.log('PushNotifications.requestPermissions() -> no es un movil');
    }
  }

  // Añadir los listeners para los eventos de Push Notifications
  addListeners() {
    // Listener de éxito en el registro de notificación (token)
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        this.guardarToken(token.value);
      }
    );

    // Listener de error en el registro de notificación
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('Error on registration: ', error);
      }
    );

    // Listener para recibir notificaciones en primer plano
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification);
        // Aquí puedes manejar la notificación, por ejemplo mostrando un toast
        this.mostrarNotificacion(notification);
      }
    );

    // Listener para manejar la acción de la notificación (cuando el usuario toca la notificación)
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Notification action performed: ', notification);
        // Aquí puedes navegar a alguna página específica o realizar alguna acción
        this.router.navigate(['/perfil']);
      }
    );
  }

  // Guardar el token en Firestore
  async guardarToken(token: string) {
    const uid = await this.firestroreAuth.getUid();
    if (uid) {
      const path = `Usuarios/${uid}/tokens`;
      const userUpdate = { token: token };
      try {
        await this.firestoreService.updateDoc(userUpdate, path, uid);
        console.log('Token guardado correctamente en Firestore');
      } catch (error) {
        console.error('Error al guardar el token en Firestore:', error);
      }
    }
  }

  // Verificar si el usuario está autenticado y luego inicializar las notificaciones
  stateAuth() {
    this.firestroreAuth.stateAuth().subscribe(res => {
      if (res !== null) {
        this.inicializar();
      }
    });
  }

  // Mostrar notificación local (puedes personalizarla con un Toast)
  async mostrarNotificacion(notification: PushNotificationSchema) {
    const toast = await this.toastController.create({
      message: notification.body,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}