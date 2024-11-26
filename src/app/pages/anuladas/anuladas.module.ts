import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnuladasPageRoutingModule } from './anuladas-routing.module';

import { AnuladasPage } from './anuladas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnuladasPageRoutingModule
  ],
  declarations: [AnuladasPage]
})
export class AnuladasPageModule {}
