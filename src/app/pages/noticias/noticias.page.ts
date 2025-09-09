import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, IonModal, LoadingController, ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/backend/usuarios.service';
import { Noticia } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { NotificacionService } from 'src/app/service/notificacion.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  noticiaSeleccionada: any = null;
  uid='';
  noticias: Noticia [] = [];
  constructor(public auth: FirestoreAuthService, public user: UsuariosService, private alertController: AlertController,
                public firestore: FirestoreService, private loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public toast: ToastController,
                 public notificacion: NotificacionService) { 
     this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.uid = res.uid;
      }
    });
  }

  ngOnInit() {
    this.obtenerNoticias();
  }

  obtenerNoticias(){
    this.firestore.getNoticias().subscribe(res => {
      this.noticias = res;
    })
  }

  abrirModal(noticia: any) {
    this.noticiaSeleccionada = noticia;
    this.modal.present();
  }

  cerrarModal() {
    this.modal.dismiss();
  }

}
