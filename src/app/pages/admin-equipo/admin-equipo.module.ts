import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminEquipoPageRoutingModule } from './admin-equipo-routing.module';

import { AdminEquipoPage } from './admin-equipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminEquipoPageRoutingModule
  ],
  declarations: [AdminEquipoPage]
})
export class AdminEquipoPageModule {}
