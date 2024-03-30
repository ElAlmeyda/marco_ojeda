import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarUserPage } from './editar-user.page';

const routes: Routes = [
  {
    path: '',
    component: EditarUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarUserPageRoutingModule {}
