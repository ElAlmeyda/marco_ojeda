import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FotoClinicaPage } from './foto-clinica.page';

const routes: Routes = [
  {
    path: '',
    component: FotoClinicaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FotoClinicaPageRoutingModule {}
