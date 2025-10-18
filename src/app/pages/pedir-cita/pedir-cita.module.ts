import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedirCitaPageRoutingModule } from './pedir-cita-routing.module';

import { PedirCitaPage } from './pedir-cita.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    PedirCitaPageRoutingModule
  ],
  declarations: [PedirCitaPage]
})
export class PedirCitaPageModule {}
