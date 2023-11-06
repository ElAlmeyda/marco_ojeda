import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticiaPageRoutingModule } from './noticia-routing.module';

import { NoticiaPage } from './noticia.page';
import { NoticiasPage } from '../noticias/noticias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoticiaPageRoutingModule
  ],
  declarations: [NoticiaPage],
  providers: [NoticiasPage]
})
export class NoticiaPageModule {}
