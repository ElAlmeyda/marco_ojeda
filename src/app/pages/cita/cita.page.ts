import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TiendaService } from 'src/app/backend/tienda.service';
import { Cita, Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';


@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
})
export class CitaPage implements OnInit {
  uid='';
  usuario: Usuario = {
    uid: '',
    nombre: '',
    email: '',
  };

  citas: Cita [] = [];

  tatuador: Tatuador | undefined;

  constructor(public firestroreAuth: FirestoreAuthService, public translate: TranslateService, public tiendaService: TiendaService, private alertController: AlertController) {
    this.firestroreAuth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuario.uid = res.uid;
        this.obtenerCitas();
      } else {
        this.usuario.uid= '';
      }
    });
   }

  ngOnInit() {
  }

  tipoKey(tipo: string): string {
    const map: {[key: string] : string} = {
      'Chico' : 'SIZE_SMALL',
      'Mediano' : 'SIZE_MEDIUM',
      'Grande' : 'SIZE_LARGE',
      'Proyecto' : 'PROJECT',
      'Retoque' : 'TOUCH_UP',
      'Piercing' : 'PIERCING',
      'Sesion' : 'SESSION',
    }
    return map[tipo] || tipo
  }
  obtenerCitas() {
    this.tiendaService.getCitasUsuario(this.usuario.uid).subscribe((citas: any) => {
      console.log('Citas del usuario:', citas);

      const ahora = new Date();

      // Filtrar citas futuras
      this.citas = citas.filter((cita:any) => {
        const fechaCita = new Date(cita.dia); // dia como string 'YYYY-MM-DD'
        if (!cita.hora) return false;

        const [hora, min] = cita.hora.split(':').map(Number);
        fechaCita.setHours(hora, min, 0, 0); // establecer hora exacta

        return fechaCita >= ahora; // solo citas futuras
      });

      // Ordenar por fecha y hora
      this.citas.sort((a, b) => {
        const fechaA = new Date(a.dia);
        const [horaA, minA] = a.hora.split(':').map(Number);
        fechaA.setHours(horaA, minA, 0, 0);

        const fechaB = new Date(b.dia);
        const [horaB, minB] = b.hora.split(':').map(Number);
        fechaB.setHours(horaB, minB, 0, 0);

        return fechaA.getTime() - fechaB.getTime();
      });

      // Obtener datos del tatuador
      this.citas.forEach(cita => {
        if (cita.uidTatuador) {
          this.tiendaService.getTatuadorById(cita.uidTatuador).subscribe(res => {
            cita.tatuador = res;
          });
        }
      });

      console.log('Citas filtradas y ordenadas:', this.citas);
    });
  }


  abrirWhatsapp(telefono: string) {
    if (telefono) {
      const url = `https://wa.me/${telefono}`;
      window.open(url, '_blank');
    }
  }

  async eliminarCita(cita: Cita, uidCita: string){
    console.log('Borrar cita:', cita);
    const header = await this.translate.get('DELETE_CONFIRM_HEADER').toPromise();
    const message = await this.translate.get('DELETE_CONFIRM_MESSAGE', { name: cita.nombreUser, time: cita.hora }).toPromise();
    const cancelText = await this.translate.get('CANCEL').toPromise();
    const deleteText = await this.translate.get('DELETE').toPromise();
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: deleteText,
          handler: () => {
            this.tiendaService.eliminarCita(cita, uidCita, this.usuario.uid);
          }
        }
      ]
    });

    await alert.present();
  }

  aceptarCita(cita: Cita) {
    return this.tiendaService.aceptarCita(cita.uidCita, cita.uidTatuador!, this.usuario.uid);
  }


  abrirMaps(direccion: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  }

}
