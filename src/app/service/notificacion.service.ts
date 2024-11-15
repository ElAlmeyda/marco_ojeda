
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

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(
    private platform: Platform,
    private router: Router,
    private firestroreAuth: FirestoreAuthService,
    private firestoreService: FirestoreService
  ) { 
    this.stateAuth();
  }

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

  addListeners() {
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        this.guardarToken(token.value);
      }
    );

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
    const uid = await this.firestroreAuth.getUid();
    if (uid) {
      const path = `Usuarios/${uid}`;
      const userUpdate = {
        token: token,
      };
      this.firestoreService.updateDoc(userUpdate, path, uid);
    }
  }

  stateAuth() {
    this.firestroreAuth.stateAuth().subscribe(res => {
      if (res !== null) {
        this.inicializar();
      }
    });
  }
}
