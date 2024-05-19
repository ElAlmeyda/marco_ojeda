import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-la-clinica',
  templateUrl: './la-clinica.page.html',
  styleUrls: ['./la-clinica.page.scss'],
})
export class LaClinicaPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;

  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef ;

  map!: google.maps.Map;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }

  initMap() {
    const clinicaLocation = { lat: 28.101109878824143, lng: -15.470295511575157 };

    const mapOptions: google.maps.MapOptions = {
     center: clinicaLocation, 
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: clinicaLocation, 
      map: this.map, 
      title: 'Clínica', 
    });

    marker.addListener('click', () => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${clinicaLocation.lat},${clinicaLocation.lng}`);
    });
  }
}
