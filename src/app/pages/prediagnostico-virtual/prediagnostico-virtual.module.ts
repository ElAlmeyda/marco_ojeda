import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrediagnosticoVirtualPageRoutingModule } from './prediagnostico-virtual-routing.module';

import { PrediagnosticoVirtualPage } from './prediagnostico-virtual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrediagnosticoVirtualPageRoutingModule
  ],
  declarations: [PrediagnosticoVirtualPage]
})
export class PrediagnosticoVirtualPageModule {}
