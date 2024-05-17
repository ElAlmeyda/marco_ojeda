import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/backend/carrito.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/backend/producto.service';
import { Producto } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  providers: []
})
export class ProductoPage implements OnInit {

  public product: any = [];
  uid='';
  public id:any;
  

  constructor(public router: ActivatedRoute, private carrito: CarritoService, public producto: ProductoService, public fireAuth: FirestoreAuthService, 
              public alertController: AlertController, public route: Router, public toastController: ToastController) {
  }

  ngOnInit() {
    this.id= this.router.snapshot.paramMap.get('id');
    this.producto.getProdCollection().subscribe(()=>{
      this.product = this.producto.getProducto(this.id);
      this.actualizarImagenes(this.product);
    });
    console.log(this.carrito);
  }

  anadirCarrito(item: Producto){
    this.fireAuth.stateAuth().subscribe(async res => {
      if(res != null){
        this.uid = res.uid;
        this.carrito.agregarAlCarrito(item);
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
                  this.route.navigate(["/inicio-sesion"]);
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
      }
    });
    
  }

  async actualizarImagenes(prod: any[]) {
    for (const prodFoto of prod) {
      if (prodFoto.foto) {
        try {
          const url = this.producto.getDownloadUrl(prodFoto.foto).subscribe(
            (url: string) => {
              prodFoto.imagenUrl = url;
            },
            (error) => {
              console.error('Error al obtener URL de descarga:', error);
            }
          );
          prodFoto.imagenUrl = url;
        } catch (error) {
          console.error('Error al obtener URL de descarga:', error);
        }
      }
    }
  }

}
