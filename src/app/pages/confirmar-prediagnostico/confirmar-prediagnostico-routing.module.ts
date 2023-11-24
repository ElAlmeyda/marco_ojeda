import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmarPrediagnosticoPage } from './confirmar-prediagnostico.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarPrediagnosticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmarPrediagnosticoPageRoutingModule {}
