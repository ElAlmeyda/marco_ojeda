import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {

  public noticias = [
    {
      id: 0,
      titulo: "Tener Protesis",
      informacion: "Lorem impusm"
    },
    {
      id: 1,
      titulo: "No Tener Protesis",
      informacion: "Lorem impusm"
    },
    {
      id: 2,
      titulo: "Dientes nuevos",
      informacion: "Lorem impusm"
    },
    {
      id: 3,
      titulo: "Caries",
      informacion: "Lorem impusm"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
