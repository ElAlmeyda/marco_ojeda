import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model';
import { FirestoreAuthService } from 'src/app/service/firestore-auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { CustomerInfo, LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {

  planes: any[] = [];
  usuarioActual: Usuario = {
    uid: '',
    nombre: '',
    correo: '',
    token: ''
  };
  selectedPlan: any = null;
  selectedPrice: number | null = null;
  selectedPlanId: string | null = null;
  buyText = 'Continuar';
  selectedPackage: any = null;

  productos: Array<{id: string, nombre: string, precio: string, package?: any}> = [];

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    public toast: ToastController,
    public firestore: FirestoreService,
    public auth: FirestoreAuthService, public translate: TranslateService
  ) {
     this.auth.stateAuth().subscribe(async res => {
      if (res != null) {
        this.usuarioActual.uid = res.uid;
      } else {
        this.usuarioActual.uid= '';
      }
    });
   }

  async ngOnInit() {
    await this.platform.ready();
      try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

        const apiKey = this.platform.is('ios')
          ? 'appl_DvawkfETtdUHEvggwucMjIGLmeb'    // Cambia por tu clave pública de iOS
          : 'goog_BKQFgSYBqZxAEaOedanxRnpUSNu';  // Clave pública de Android

        await Purchases.configure({ apiKey });

        const offerings = await Purchases.getOfferings();

        const premiumOffering = offerings.all['iOS'];

        this.productos = [];

        if (premiumOffering && premiumOffering.availablePackages.length > 0) {
          const pkg = premiumOffering.availablePackages[0];
          console.log(pkg);
          this.productos.push({
            id: pkg.product.identifier,
            nombre: 'Plan Sin Anuncios',
            precio: pkg.product.priceString,
            package: pkg
          });

        }
      } catch (error) {
        console.error('Error inicializando compras o cargando offerings:', error);
      }
  }

  volver() {
    this.navCtrl.back();
  }

  selectPlan(plan: any) {
    this.selectedPackage = plan.package;
    this.selectedPlanId = plan.id;
    this.buyText = `Pagar ${plan.precio}`;
    console.log("Plan completo:", JSON.stringify(plan, null, 2));
  }

  
  async pagar() {
      if (!this.selectedPackage) {
        this.presentToast(this.translate.instant('PAYMENT.SELECT_PLAN_FIRST'), 'warning');
        return;
      }

      try {
        const { customerInfo }: { customerInfo: CustomerInfo } = await Purchases.purchasePackage({
          aPackage: this.selectedPackage
        });

        console.log('Compra exitosa:', customerInfo);

        const userId = this.usuarioActual.uid; // Asumiendo que tienes el uid
        const fechaCompra = new Date();
        const fechaExpiracion = new Date(fechaCompra);
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

        await this.firestore.updatePremium(userId, {
          planId: this.selectedPackage.product.identifier,
          entitlementId: customerInfo.entitlements.active,
          fechaCompra: fechaCompra.toISOString(),
          fechaExpiracion: fechaExpiracion.toISOString(),
          activo: true,
        });

        this.presentToast(this.translate.instant('PAYMENT.SUCCESS_PURCHASE'), 'success');
        // Aquí puedes guardar el estado de la suscripción en tu backend
      } catch (error: any) {
        if (error.userCancelled) {
          console.log('🟡 El usuario canceló manualmente la compra.');
        } else {
          console.error('❌ Error durante el proceso de compra:', error);
          if (error.code === 'NetworkError') {
            this.presentToast('Error de red. Intenta de nuevo.', 'danger');
          } else if (error.code === 'PurchaseInvalidError') {
            this.presentToast('Compra inválida.', 'danger');
          } else {    
            this.presentToast('Error al procesar la compra.', 'danger');
          }
        }
      }
      this.navCtrl.navigateForward(['/tabs/folder', this.usuarioActual.uid]);
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: color
    });

    await toast.present();
  }

}
