import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PideCitaPage } from './pide-cita.page';

const routes: Routes = [
  {
    path: '',
    component: PideCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PideCitaPageRoutingModule {}
