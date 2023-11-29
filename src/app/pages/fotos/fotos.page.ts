import { Component, OnInit, ViewChild } from '@angular/core';


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

  }

}
