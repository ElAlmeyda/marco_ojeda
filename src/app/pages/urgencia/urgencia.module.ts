import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UrgenciaPageRoutingModule } from './urgencia-routing.module';

import { UrgenciaPage } from './urgencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UrgenciaPageRoutingModule
  ],
  declarations: [UrgenciaPage]
})
export class UrgenciaPageModule {}
