import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FotoClinicaPageRoutingModule } from './foto-clinica-routing.module';

import { FotoClinicaPage } from './foto-clinica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FotoClinicaPageRoutingModule
  ],
  declarations: [FotoClinicaPage]
})
export class FotoClinicaPageModule {}
