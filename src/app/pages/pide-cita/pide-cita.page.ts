import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-pide-cita',
  templateUrl: './pide-cita.page.html',
  styleUrls: ['./pide-cita.page.scss'],
})
export class PideCitaPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;

  messageDentista = '';
  messageDia = '';
  messageHorario = '';
  messageServicio = '';
  name!: string;


  public servicioDentista = [
    {
      id: 0,
      nombre: "Primera Visita"
    },
    {
      id: 1,
      nombre: "Aparatos"
    },
    {
      id: 2,
      nombre: "Extraer Muela"
    },
  ];
  

  constructor() { }

  ngOnInit() {
  }
  

  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.messageServicio = "Primera Visita";
    this.modal.dismiss(null, this.messageServicio);
  }

}
