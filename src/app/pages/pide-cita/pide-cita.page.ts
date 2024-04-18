import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CitaService } from 'src/app/backend/cita.service';
import { EquipoServiceService } from 'src/app/backend/equipo-service.service';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Empleado, Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';


@Component({
  selector: 'app-pide-cita',
  templateUrl: './pide-cita.page.html',
  styleUrls: ['./pide-cita.page.scss'],
})
export class PideCitaPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  modalAbierto = false;
  uid='';

  dia: Date | null = null;
  especialista='';
  hora='';
  servicio='';
  fechaModificada = '';
  today:any;

  usuario: Usuario = {
    nombre: '',
    uid: '',
    correo: '',
    movil: '',
    password: '',
    rol:''
  };

  public empleado: Empleado[] = [];


  userLogin= false;
  
  constructor(private user: UsuariosService, private datePipe: DatePipe, public auth: FirestoreAuthService, public firestore: FirestoreService, public equipo: EquipoServiceService,
              public cita: CitaService, public alertController: AlertController, public router: Router) {

    this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
        const usuario = this.user.getUsuario();
        this.obtenerUsuario();
      } else {
        const alert = await this.alertController.create({
          header: 'No esta logueado',
          message: 'Si quiere acceder a la tienda tiene que loguearse',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
              }
            }, {
              text: 'Inicie sesion',
              handler: async () => {
                try {
                  this.router.navigate(["/inicio-sesion"]);
                } catch (error) {
                  console.error("Error al crear el empleado:", error);
                }finally {
                  // Cierra la alerta después de ejecutar las operaciones de eliminación
                  await alert.dismiss();
                }
              }
            }
          ]
        });
        await alert.present();
        this.uid= '';
      }
    });
   }

  ngOnInit() {
    this.modalAbierto = false;
    this.getDate();
    this.getEquipo();
  }

  getEquipo(){
    this.equipo.getEquipo().subscribe(() => {
      this.empleado = this.equipo.getOdontologos();
    });
  }

  obtenerUsuario() {
    this.user.getUsuarios().subscribe(() => {
      const usuario = this.user.getUsuarioConcreto(this.uid);
      if (usuario) {
        this.usuario = usuario;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }

  confirm() {
    this.fechaModificada = this.dia ? this.datePipe.transform(this.dia, 'dd-MM-yyyy') ?? '' : '';
    this.modalAbierto = false;
    return this.modal.dismiss(null, 'cancel');
  }

  enviar(){
    this.cita.guardarCita(this.usuario.nombre, this.servicio, this.usuario.movil, this.especialista, this.fechaModificada, this.hora, this.uid);
  }

  getDate() { const date = new Date(); this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2); }


  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  }; 
  
  cancel() {
    this.modalAbierto = false;
    return this.modal.dismiss(null, 'cancel');
  }
}

