import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarNoticiaPageRoutingModule } from './editar-noticia-routing.module';

import { EditarNoticiaPage } from './editar-noticia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarNoticiaPageRoutingModule
  ],
  declarations: [EditarNoticiaPage]
})
export class EditarNoticiaPageModule {}
