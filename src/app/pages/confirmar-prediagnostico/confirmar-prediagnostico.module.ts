import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmarPrediagnosticoPageRoutingModule } from './confirmar-prediagnostico-routing.module';

import { ConfirmarPrediagnosticoPage } from './confirmar-prediagnostico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmarPrediagnosticoPageRoutingModule
  ],
  declarations: [ConfirmarPrediagnosticoPage]
})
export class ConfirmarPrediagnosticoPageModule {}
