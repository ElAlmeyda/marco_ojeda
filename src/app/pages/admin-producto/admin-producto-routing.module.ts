import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminProductoPage } from './admin-producto.page';

const routes: Routes = [
  {
    path: '',
    component: AdminProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProductoPageRoutingModule {}
