import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';


@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {

  id = -1;

  images = [
    'assets/icon/A03018B1-3DBF-4955-AE58-F2CC6C509380.PNG',
    'assets/icon/o_1cj31qpibjo51a4vtqf4m65ia.png',
    'assets/icon/o_1glaaenhd4m37rh1dppap8166la.jpg',
  ];
  currentIndex = 0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Obtener el valor del parámetro 'id' y convertirlo a un número
      const idFromUrl = params.get('id');

      // Verificar la nulidad antes de intentar la conversión
      this.id = idFromUrl !== null ? parseInt(idFromUrl, 10) : 0;
    });

    // Cambia la imagen cada 5 segundos (ajusta según sea necesario)
    interval(5000).subscribe(() => this.showNext());

    // Suscribirse a los cambios en los parámetros de la URL
    
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

}
