import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KidPlanetPageRoutingModule } from './kid-planet-routing.module';

import { KidPlanetPage } from './kid-planet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KidPlanetPageRoutingModule
  ],
  declarations: [KidPlanetPage]
})
export class KidPlanetPageModule {}
