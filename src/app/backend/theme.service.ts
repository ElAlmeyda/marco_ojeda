import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  constructor(private storage: Storage) {}

  async init() {
    await this.storage.create(); // ← asegura que storage esté listo
    const tema = await this.storage.get('app_theme');
    this.aplicarTema(tema || 'dark');
  }

  aplicarTema(tema: 'dark' | 'light') {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(tema === 'light' ? 'light-theme' : 'dark-theme');
  }

  async cambiarTema(tema: 'dark' | 'light') {
    await this.storage.create(); // por si acaso
    await this.storage.set('app_theme', tema);
    this.aplicarTema(tema);
  }

  getTemaActual(): 'dark' | 'light' {
    return document.body.classList.contains('light-theme') ? 'light' : 'dark';
  }
}