import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 40.4168, lng: -3.7038 },
      zoom: 14,
      disableDefaultUI: true, // (opcional) quita controles predeterminados
      styles: [
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
}


  cargarMapa() {
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 40.4168, lng: -3.7038 }, // Cambia por tu ubicación
      zoom: 14,
      styles: [
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }]
        }
      ]
    });


    new google.maps.Marker({
      position: { lat: 40.4168, lng: -3.7038 },
      map,
      title: "Ubicación de prueba",
    });
  }

}
