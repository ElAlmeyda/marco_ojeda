import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaPageRoutingModule } from './dia-routing.module';

import { DiaPage } from './dia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiaPageRoutingModule
  ],
  declarations: [DiaPage]
})
export class DiaPageModule {}
