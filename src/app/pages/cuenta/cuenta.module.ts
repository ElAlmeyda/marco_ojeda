import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentaPageRoutingModule } from './cuenta-routing.module';

import { CuentaPage } from './cuenta.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CuentaPageRoutingModule
  ],
  declarations: [CuentaPage]
})
export class CuentaPageModule {}
