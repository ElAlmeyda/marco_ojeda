import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Tatuador } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  tatuadoresDelEvento: Tatuador[] = [];
  evento: any[] = [];
  eventoSeleccionado: any = null;

  constructor(public firestore: FirestoreService, public navCtrl: NavController,) { }

  ngOnInit() {
    this.obtenerOventos();
  }

  volver(){
    if(this.eventoSeleccionado){
      this.eventoSeleccionado = null
    } else {
      this.navCtrl.back();
    }
  }

  obtenerOventos(){
    this.firestore.getEvento().subscribe(res => {
      console.log("Res evento:", JSON.stringify(res));

      this.evento = res;
    })
  }

  seleccionarEvento(evento: any) {
    this.eventoSeleccionado = evento;
  }

   abrirMaps(direccion: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  }
  
}
