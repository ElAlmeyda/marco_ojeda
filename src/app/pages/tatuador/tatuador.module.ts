import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TatuadorPageRoutingModule } from './tatuador-routing.module';

import { TatuadorPage } from './tatuador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TatuadorPageRoutingModule
  ],
  declarations: [TatuadorPage]
})
export class TatuadorPageModule {}
