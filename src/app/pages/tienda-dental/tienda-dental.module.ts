import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiendaDentalPageRoutingModule } from './tienda-dental-routing.module';

import { TiendaDentalPage } from './tienda-dental.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TiendaDentalPageRoutingModule
  ],
  declarations: [TiendaDentalPage]
})
export class TiendaDentalPageModule {}
