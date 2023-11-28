import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminNoticiaPage } from './admin-noticia.page';

const routes: Routes = [
  {
    path: '',
    component: AdminNoticiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminNoticiaPageRoutingModule {}
