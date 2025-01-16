import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/backend/carrito.service';
import { Pedido } from 'src/app/model';
import { FirestoreService } from 'src/app/service/firestore.service';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.page.html',
  styleUrls: ['./admin-pedidos.page.scss'],
})
export class AdminPedidosPage implements OnInit {

  pedidos: Pedido[]=[];

  constructor(public firestore: FirestoreService, public carritoService: CarritoService) { }

  ngOnInit() {
    this.getPedidos();
  }

  getPedidos(){
    this.firestore.getUserPedidosPagados().subscribe((pedidos) => {
      this.pedidos = pedidos.filter(pedido => pedido.estado === 'pagado');
    });
  }

  pedidoEntregado(item: Pedido){
    console.log(item);
    this.carritoService.updatePedido(item);
  }

}
