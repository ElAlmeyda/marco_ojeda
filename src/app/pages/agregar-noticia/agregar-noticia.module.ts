import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarNoticiaPageRoutingModule } from './agregar-noticia-routing.module';

import { AgregarNoticiaPage } from './agregar-noticia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarNoticiaPageRoutingModule
  ],
  declarations: [AgregarNoticiaPage]
})
export class AgregarNoticiaPageModule {}
