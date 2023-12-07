import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tienda-dental',
  templateUrl: './tienda-dental.page.html',
  styleUrls: ['./tienda-dental.page.scss'],
})
export class TiendaDentalPage implements OnInit {

  public items = [
    {
      id: 0,
      name: "cepillo de dientes",
      precio: 10
    }, 
    {
      id: 1,
      name: "enjuague",
      precio: 5
    }, 
    {
      id: 2,
      name: "bracket",
      precio: 20
    }, 
    {
      id: 3,
      name: "diente postizo",
      precio: 10
    },
    {
      id: 4,
      name: "diente de oro",
      precio: 1000
    } 
  ];

  constructor() { }

  ngOnInit() {
  }

}
