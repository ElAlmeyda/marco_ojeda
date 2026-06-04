import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Planta } from 'src/app/model';

declare var google: any;


@Component({
  selector: 'app-la-clinica',
  templateUrl: './la-clinica.page.html',
  styleUrls: ['./la-clinica.page.scss'],
})
export class LaClinicaPage implements OnInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  vistaActual: 'home' | 'novedades' | 'plantas' | 'carrusel' = 'home';
  plantaActual: Planta | null = null;
  currentIndex = 0;
  images: string[] = [];

  novedades = [
    'No parecemos una clínica',
    'Roof Terrace',
    'Mimamos al personal',
    'Plato TV',
    'Mini Bar',
    'Planta para niños',
    'Tour Dental',
    'No nos gustan las financieras',
    'Somos solidarios',
    'Siempre innovando',
  ];

  plantas: any[] = [
    { id: '-1', label: '−1', nombre: 'Planta −1', desc: 'Acceso y servicios principales',      caption: 'Planta diseñada para facilitar el acceso y los servicios esenciales con máxima comodidad.' },
    { id: '0',  label: '0',  nombre: 'Planta 0',  desc: 'Recepción y zona de espera',           caption: 'La recepción que rompe con el concepto clínico tradicional — cálida, luminosa y acogedora.' },
    { id: '1',  label: '1',  nombre: 'Planta 1',  desc: 'Consultas y tratamientos',             caption: 'Consultas equipadas con la última tecnología en un entorno sereno y confortable.' },
    { id: '2',  label: '2',  nombre: 'Planta 2',  desc: 'Área quirúrgica especializada',        caption: 'Área quirúrgica de vanguardia con los más altos estándares de precisión y cuidado.' },
    { id: '3',  label: '☀',  nombre: 'Roof Terrace', desc: 'Espacio exclusivo en la azotea',   caption: 'Nuestro Roof Terrace: un espacio único para recuperarse bajo el cielo abierto.' },
  ];

  private clinicaLocation = { lat: 28.101109878824143, lng: -15.470295511575157 };
  map!: google.maps.Map;

  ngOnInit() {}

  irA(vista: 'novedades' | 'plantas') {
    this.vistaActual = vista;
  }

  abrirCarrusel(planta: Planta) {
    this.plantaActual = planta;
    this.currentIndex = 0;
    // Sustituye esto con tus rutas reales de assets
    this.images = this.getImagenesPlanta(planta.id);
    this.vistaActual = 'carrusel';
  }

  getImagenesPlanta(id: string): string[] {
    // Ajusta las rutas según tu estructura de assets
    const base = `../../../assets/clinica/planta${id}`;
    return [
      `${base}/foto1.jpg`,
      `${base}/foto2.jpg`,
      `${base}/foto3.jpg`,
    ];
  }

  volverVista() {
    if (this.vistaActual === 'carrusel') this.vistaActual = 'plantas';
    else if (this.vistaActual === 'plantas') this.vistaActual = 'home';
    else if (this.vistaActual === 'novedades') this.vistaActual = 'home';
    else this.vistaActual = 'home';
  }

  backHref(): string {
    if (this.vistaActual === 'carrusel') return '/clinica';
    return '/clinica';
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  initMap() {
    if (!this.mapElement?.nativeElement) return;

    const mapOptions: google.maps.MapOptions = {
      center: this.clinicaLocation,
      zoom: 15,
      disableDefaultUI: true,
      styles: [
        { elementType: 'geometry',        stylers: [{ color: '#1a1a1c' }] },
        { elementType: 'labels.text.fill',stylers: [{ color: '#6a6a60' }] },
        { elementType: 'labels.text.stroke',stylers: [{ color: '#131315' }] },
        { featureType: 'road',            elementType: 'geometry',       stylers: [{ color: '#2a2a2e' }] },
        { featureType: 'road',            elementType: 'geometry.stroke', stylers: [{ color: '#131315' }] },
        { featureType: 'road.highway',    elementType: 'geometry',       stylers: [{ color: '#2a2a2e' }] },
        { featureType: 'water',           elementType: 'geometry',       stylers: [{ color: '#0e0e0f' }] },
        { featureType: 'poi',             elementType: 'geometry',       stylers: [{ color: '#1a1a1c' }] },
        { featureType: 'poi.park',        elementType: 'geometry',       stylers: [{ color: '#161a15' }] },
        { featureType: 'transit',         elementType: 'geometry',       stylers: [{ color: '#1a1a1c' }] },
      ],
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: this.clinicaLocation,
      map: this.map,
      title: 'Clínica Almeida',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#c9a84c',
        fillOpacity: 1,
        strokeColor: '#f0d060',
        strokeWeight: 2,
      },
    });

    marker.addListener('click', () => this.abrirMaps());
  }

  abrirMaps() {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${this.clinicaLocation.lat},${this.clinicaLocation.lng}`
    );
  }
}
