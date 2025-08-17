import { Component, OnInit } from '@angular/core';
import { TiendaService } from 'src/app/backend/tienda.service';
import { Cita, Tatuador, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

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
    correo: '',
  };

  citas: Cita [] = [];

  tatuador: Tatuador | undefined;

  constructor(public firestroreAuth: FirestoreAuthService, public tiendaService: TiendaService) {
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

  obtenerCitas(){
    this.tiendaService.getCitasUsuario(this.usuario.uid).subscribe((citas: any) => {
      console.log('Citas del usuario:', citas);
      this.citas = citas;
      this.citas.sort((a, b) => {
        const fechaA = new Date(a.dia).getTime();
        const fechaB = new Date(b.dia).getTime();

        if (fechaA !== fechaB) {
          return fechaA - fechaB; // orden por día
        }

        // Si es el mismo día, comparar por hora
        // Suponiendo que `a.hora` y `b.hora` están en formato 'HH:mm'
        const [horaA, minA] = a.hora.split(':').map(Number);
        const [horaB, minB] = b.hora.split(':').map(Number);

        return (horaA * 60 + minA) - (horaB * 60 + minB); // orden por hora
      });

      this.citas.forEach(cita => {
        if(cita.uidTatuador)
        this.tiendaService.getTatuadorById(cita.uidTatuador).subscribe(res => {
          cita.tatuador = res;
        })
      });
    });
  }

    abrirWhatsapp(telefono: string) {
    if (telefono) {
      const url = `https://wa.me/${telefono}`;
      window.open(url, '_blank');
    }
  }

  eliminarCita(cita: Cita){
    
  }

}
