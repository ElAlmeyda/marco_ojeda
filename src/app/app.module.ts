import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { EquipoServiceService } from './backend/equipo-service.service';
import { CommonModule, DatePipe } from '@angular/common';

import { getAuth, provideAuth} from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {  } from '@angular/fire';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxPayPalModule } from 'ngx-paypal';
import { Calendar } from '@ionic-native/calendar/ngx';
import { StatusBar } from '@ionic-native/status-bar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, IonicModule, CommonModule,  
    AngularFireModule.initializeApp(environment.firebaseConfig), NgxPayPalModule, AngularFireStorageModule, AngularFirestoreModule,
    //provideAppCheck(() => { 
      // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_ //const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
      //return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    //}), 
  provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), 
  provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), providePerformance(() => getPerformance()), provideStorage(() => getStorage()), provideRemoteConfig(() => getRemoteConfig()), ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, EquipoServiceService, DatePipe, ScreenTrackingService, UserTrackingService, Calendar, (isDevMode() ? [] : [StatusBar])],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
