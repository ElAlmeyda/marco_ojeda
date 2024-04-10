import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarCalendarioPageRoutingModule } from './editar-calendario-routing.module';

import { EditarCalendarioPage } from './editar-calendario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarCalendarioPageRoutingModule
  ],
  declarations: [EditarCalendarioPage]
})
export class EditarCalendarioPageModule {}
