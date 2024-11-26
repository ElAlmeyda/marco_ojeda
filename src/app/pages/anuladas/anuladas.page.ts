import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CitaService } from 'src/app/backend/cita.service';
import { Cita } from 'src/app/model';

@Component({
  selector: 'app-anuladas',
  templateUrl: './anuladas.page.html',
  styleUrls: ['./anuladas.page.scss'],
})
export class AnuladasPage implements OnInit {

  citasAnuladas!: Cita[];


  constructor(public citas: CitaService, public alertController: AlertController) { }

  ngOnInit() {
    this.obtenerCitasAnuladas();

  }

  obtenerCitasAnuladas(){
    this.citas.getCitasAnuladas().subscribe( res => {
      if(res){
        this.citasAnuladas = res;
        this.citasAnuladas.sort((a, b) => {
          const fechaA = new Date(a.dia);  // Suponiendo que "dia" es la fecha de la cita
          const fechaB = new Date(b.dia);
          return fechaA.getTime() - fechaB.getTime();  // Orden ascendente (de más cercano a más lejano)
        });
      }
    });
  }


  async anularCita(item: Cita){
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Se eliminara la cita de la base de datos',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.citas.eliminarCita(item);
          }
        }
      ]
    });
  
    await alert.present();
  }

}
