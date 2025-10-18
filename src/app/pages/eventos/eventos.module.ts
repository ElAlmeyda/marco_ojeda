import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EventosPageRoutingModule
  ],
  declarations: [EventosPage]
})
export class EventosPageModule {}
