import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnuladasPage } from './anuladas.page';

const routes: Routes = [
  {
    path: '',
    component: AnuladasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnuladasPageRoutingModule {}
