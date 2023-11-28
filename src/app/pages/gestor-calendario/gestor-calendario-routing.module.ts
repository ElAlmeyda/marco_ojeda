import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestorCalendarioPage } from './gestor-calendario.page';

const routes: Routes = [
  {
    path: '',
    component: GestorCalendarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorCalendarioPageRoutingModule {}
