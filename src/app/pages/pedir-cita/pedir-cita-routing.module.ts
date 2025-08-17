import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedirCitaPage } from './pedir-cita.page';

const routes: Routes = [
  {
    path: '',
    component: PedirCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedirCitaPageRoutingModule {}
