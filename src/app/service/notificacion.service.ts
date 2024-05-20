import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotification,
  PushNotificationSchema,
  PushNotificationToken,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Route, Router } from '@angular/router';
import { FirestoreAuthService } from './firestore-auth.service';
import { FirestoreService } from './firestore.service';

const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(public platform: Platform, public router: Router,public firestroreAuth: FirestoreAuthService, public firestoreService: FirestoreService) { 
    this.stateAuth();
  }

  inicializar(){
    if(this.platform.is('capacitor')){
        PushNotifications.requestPermissions().then( result => {
        if(result.receive === 'granted'){
          PushNotifications.register();
          this.addListeners();
        }
      });
    } else {
      console.log('PushNotifications.requestPermissions() -> no es un movil')
    }
  }

  addListeners(){

    PushNotifications.addListener('registration',
      (token: Token) => {
        this.guardarToken(token.value);
        alert('Push registration success, token: ' + token.value);
      }
    );
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

  // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        LocalNotifications['schedule']({
          notifications: [
            {
              title: 'Notificación de prueba',
              body: 'Esta es una notificación de prueba',
              id: 1,
              schedule: { at: new Date(Date.now() + 1000) },
              sound: null,
              attachments: null,
              actionTypeId: '',
              extra: null
            }
          ]
        });
      }
    );

  // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        this.router.navigate(['/perfil'])
      }
    );
  }

  async guardarToken(token: any){
    const uid = await this.firestroreAuth.getUid();
    if(uid){
      const path = 'Usuarios/';
      const userUpdate = {
        token: token,
      }
      this.firestoreService.updateDoc(userUpdate, path, uid);
    }
  }

  stateAuth(){
    this.firestroreAuth.stateAuth().subscribe( res => {
      if(res !== null){
        this.inicializar();
      }
    });
  }
}

