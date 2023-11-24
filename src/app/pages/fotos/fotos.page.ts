import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {

  public items=5;
  public currentPosition=0;

  constructor() { }

  ngOnInit() {

    document.addEventListener('DOMContentLoaded', () => {
      const elementosCarrusel = document.querySelectorAll('.carrusel');
      //M.Carousel.init(elementosCarrusel, {
        //duration: 150
      //}); 
    });
  }

  siguienteFoto(){
    let nextPosition = this.currentPosition+1;
    if(nextPosition <= this.items){
      
    } else {
      nextPosition = 0;
    }
  }

  atrasFoto(){
    let backPosition = this.currentPosition-1;
    if(backPosition <= this.items){
      
    } else {
      backPosition = this.items;
    }
  }

}
