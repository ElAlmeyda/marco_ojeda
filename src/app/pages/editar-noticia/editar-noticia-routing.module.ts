import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarNoticiaPage } from './editar-noticia.page';

const routes: Routes = [
  {
    path: '',
    component: EditarNoticiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarNoticiaPageRoutingModule {}
