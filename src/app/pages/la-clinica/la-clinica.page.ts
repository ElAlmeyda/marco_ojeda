import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-la-clinica',
  templateUrl: './la-clinica.page.html',
  styleUrls: ['./la-clinica.page.scss'],
})
export class LaClinicaPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;

  constructor() { }

  ngOnInit() {
  }

  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }
}
