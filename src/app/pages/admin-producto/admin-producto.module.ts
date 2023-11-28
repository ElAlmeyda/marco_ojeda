import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminProductoPageRoutingModule } from './admin-producto-routing.module';

import { AdminProductoPage } from './admin-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminProductoPageRoutingModule
  ],
  declarations: [AdminProductoPage]
})
export class AdminProductoPageModule {}
