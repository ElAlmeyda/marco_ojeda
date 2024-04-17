import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestorPage } from './gestor.page';

const routes: Routes = [
  {
    path: '',
    component: GestorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorPageRoutingModule {}
