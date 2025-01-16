import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/backend/carrito.service';
import { Pedido, Usuario } from 'src/app/model';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})
export class RedirectPage implements OnInit {

  estado='';
  orderId = '';
  success =false;
  cliente !: Usuario;
  public carrito!: Pedido;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.estado = params['status']; 
      this.orderId = params['orderId'];

      setTimeout(() => {
        window.location.href = `https://servicio-4f831.web.app/carrito?status=${this.estado}&orderId=${this.orderId}`;
      }, 1000); 
    });
  }

}
