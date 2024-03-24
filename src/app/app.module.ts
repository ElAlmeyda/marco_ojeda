import { NgModule } from '@angular/core';
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

import {  } from '@angular/fire';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, CommonModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => 
    initializeApp({"projectId":"servicio-4f831","appId":"1:867441361379:web:4048cbd33afbfb169ee0d6","databaseURL":"https://servicio-4f831-default-rtdb.firebaseio.com","storageBucket":"servicio-4f831.appspot.com","apiKey":"AIzaSyBSx_zX2iUbKScJo__1dV9_luyxQzTpJpk","authDomain":"servicio-4f831.firebaseapp.com","messagingSenderId":"867441361379","measurementId":"G-12GCW4T1V0"})), 
    provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), 
    //provideAppCheck(() => { 
      // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_ //const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
      //return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    //}), 
  provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), 
  provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), providePerformance(() => getPerformance()), provideStorage(() => getStorage()), provideRemoteConfig(() => getRemoteConfig())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, EquipoServiceService, DatePipe, ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
