import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EspecialistaPage } from './especialista.page';

const routes: Routes = [
  {
    path: '',
    component: EspecialistaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EspecialistaPageRoutingModule {}
