import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PideCitaPageRoutingModule } from './pide-cita-routing.module';

import { PideCitaPage } from './pide-cita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PideCitaPageRoutingModule
  ],
  declarations: [PideCitaPage]
})
export class PideCitaPageModule {}
