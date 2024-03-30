import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarUserPage } from './agregar-user.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarUserPageRoutingModule {}
