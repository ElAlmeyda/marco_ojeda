import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TatuadorPageRoutingModule } from './tatuador-routing.module';

import { TatuadorPage } from './tatuador.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TatuadorPageRoutingModule
  ],
  declarations: [TatuadorPage]
})
export class TatuadorPageModule {}
