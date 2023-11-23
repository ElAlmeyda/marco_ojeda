import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KidPlanetPage } from './kid-planet.page';

const routes: Routes = [
  {
    path: '',
    component: KidPlanetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KidPlanetPageRoutingModule {}
