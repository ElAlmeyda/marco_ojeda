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
import { alertController } from '@ionic/vue';

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
    console.log('Initializing Notificacion');

    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });
    this.addListeners();
  }

  // Añadir los listeners para los eventos de Push Notifications
  addListeners() {
    // Listener de éxito en el registro de notificación (token)
    PushNotifications.addListener('registration',
      (token: Token) => {
        alert('Push registration success, token: ' + token.value);
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
        await this.firestoreService.creatDoc(userUpdate, path, uid);
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