import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiendaDentalPage } from './tienda-dental.page';

const routes: Routes = [
  {
    path: '',
    component: TiendaDentalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiendaDentalPageRoutingModule {}
