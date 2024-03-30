import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarUserPageRoutingModule } from './agregar-user-routing.module';

import { AgregarUserPage } from './agregar-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarUserPageRoutingModule
  ],
  declarations: [AgregarUserPage]
})
export class AgregarUserPageModule {}
