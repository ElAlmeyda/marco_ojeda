import { Component, OnInit, ViewChild } from '@angular/core';
import { interval } from 'rxjs';


@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {

  images = [
    'assets/icon/A03018B1-3DBF-4955-AE58-F2CC6C509380.PNG',
    'assets/icon/o_1cj31qpibjo51a4vtqf4m65ia.png',
    'assets/icon/o_1glaaenhd4m37rh1dppap8166la.jpg',
  ];
  currentIndex = 0;

  constructor() { }

  ngOnInit() {
    // Cambia la imagen cada 5 segundos (ajusta según sea necesario)
    interval(5000).subscribe(() => this.showNext());

  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

}
