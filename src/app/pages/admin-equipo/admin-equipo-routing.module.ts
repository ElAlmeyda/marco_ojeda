import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminEquipoPage } from './admin-equipo.page';

const routes: Routes = [
  {
    path: '',
    component: AdminEquipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminEquipoPageRoutingModule {}
