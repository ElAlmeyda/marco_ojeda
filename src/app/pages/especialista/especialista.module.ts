import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EspecialistaPageRoutingModule } from './especialista-routing.module';

import { EspecialistaPage } from './especialista.page';
import { EquipoPage } from '../equipo/equipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EspecialistaPageRoutingModule
  ],
  declarations: [EspecialistaPage],
  providers: [EquipoPage]
})
export class EspecialistaPageModule {}
