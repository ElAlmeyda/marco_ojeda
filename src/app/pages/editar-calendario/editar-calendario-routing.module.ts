import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarCalendarioPage } from './editar-calendario.page';

const routes: Routes = [
  {
    path: '',
    component: EditarCalendarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarCalendarioPageRoutingModule {}
