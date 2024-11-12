import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }

  show() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) splashScreen.style.display = 'block';
  }

  hide() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) splashScreen.style.display = 'none';
  }
}
