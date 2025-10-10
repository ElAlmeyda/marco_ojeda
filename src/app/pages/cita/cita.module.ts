import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitaPageRoutingModule } from './cita-routing.module';

import { CitaPage } from './cita.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CitaPageRoutingModule
  ],
  declarations: [CitaPage]
})
export class CitaPageModule {}
