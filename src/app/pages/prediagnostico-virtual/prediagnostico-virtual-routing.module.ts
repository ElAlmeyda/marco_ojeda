import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrediagnosticoVirtualPage } from './prediagnostico-virtual.page';

const routes: Routes = [
  {
    path: '',
    component: PrediagnosticoVirtualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrediagnosticoVirtualPageRoutingModule {}
