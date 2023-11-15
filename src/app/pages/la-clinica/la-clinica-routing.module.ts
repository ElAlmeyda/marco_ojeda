import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaClinicaPage } from './la-clinica.page';

const routes: Routes = [
  {
    path: '',
    component: LaClinicaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaClinicaPageRoutingModule {}
