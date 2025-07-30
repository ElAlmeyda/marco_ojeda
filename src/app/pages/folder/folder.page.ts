import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { TiendaService } from 'src/app/backend/tienda.service';
import { Tienda } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  searchTerm: string = '';
  recomendado !: Tienda[]
  
  constructor(public tienda: TiendaService) {}

  ngOnInit() {
    this.obtenerTienda();
  }

  obtenerTienda(){
    
  }

  buscarMatches() {
    if (this.searchTerm.trim() !== '') {

    } else {
    }
  }

}
