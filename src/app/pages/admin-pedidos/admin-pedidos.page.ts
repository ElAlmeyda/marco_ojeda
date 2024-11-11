import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.page.html',
  styleUrls: ['./admin-pedidos.page.scss'],
})
export class AdminPedidosPage implements OnInit {

  pedidos: Pedido[]=[];

  constructor(public firestore: FirestoreService) { }

  ngOnInit() {
    this.getPedidos();
  }

  getPedidos(){
    this.firestore.getUserPedidos().subscribe((pedidos) => {
      this.pedidos = pedidos.filter(pedido => pedido.estado === 'aceptado');
      console.log('Pedidos Aceptados: ', this.pedidos);
    });
  }

}
