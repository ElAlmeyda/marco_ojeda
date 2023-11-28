import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestorCalendarioPageRoutingModule } from './gestor-calendario-routing.module';

import { GestorCalendarioPage } from './gestor-calendario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestorCalendarioPageRoutingModule
  ],
  declarations: [GestorCalendarioPage]
})
export class GestorCalendarioPageModule {}
