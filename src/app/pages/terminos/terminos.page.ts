import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
})
export class TerminosPage implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  irAtras() {
    this.navController.back();
  }

}
