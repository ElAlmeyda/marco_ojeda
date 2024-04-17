import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiaPage } from './dia.page';

const routes: Routes = [
  {
    path: '',
    component: DiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaPageRoutingModule {}
