import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { UsuariosService } from 'src/app/backend/usuarios.service';


@Component({
  selector: 'app-pide-cita',
  templateUrl: './pide-cita.page.html',
  styleUrls: ['./pide-cita.page.scss'],
})
export class PideCitaPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;


  dia: Date | null = null;
  nombre='';
  phone='';
  especialista='';
  hora='';
  servicio='';
  fechaModificada = '';
  today:any;


  userLogin= false;
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    /**
     * Date will be enabled if it is not
     * Sunday or Saturday
     */
    return utcDay !== 0 && utcDay !== 6;
  };
  

  constructor(private user: UsuariosService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getDate();
  }
  

  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.fechaModificada = this.dia ? this.datePipe.transform(this.dia, 'dd-MM-yyyy') ?? '' : '';
    return this.modal.dismiss(null, 'cancel');
  }

  enviar(){

    console.log(this.hora, this.especialista, this.servicio, this.nombre, this.fechaModificada, this.phone);
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); }
}

