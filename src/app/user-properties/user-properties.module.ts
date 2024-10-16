import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPropertiesPageRoutingModule } from './user-properties-routing.module';

import { UserPropertiesPage } from './user-properties.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPropertiesPageRoutingModule
  ],
  declarations: [UserPropertiesPage]
})
export class UserPropertiesPageModule {}
