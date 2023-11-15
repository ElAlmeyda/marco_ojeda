import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaClinicaPageRoutingModule } from './la-clinica-routing.module';

import { LaClinicaPage } from './la-clinica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaClinicaPageRoutingModule
  ],
  declarations: [LaClinicaPage]
})
export class LaClinicaPageModule {}
