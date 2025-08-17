import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TatuadorPage } from './tatuador.page';

const routes: Routes = [
  {
    path: '',
    component: TatuadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TatuadorPageRoutingModule {}
