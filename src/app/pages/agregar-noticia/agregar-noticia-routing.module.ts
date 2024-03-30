import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarNoticiaPage } from './agregar-noticia.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarNoticiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarNoticiaPageRoutingModule {}
