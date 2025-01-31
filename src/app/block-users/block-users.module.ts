import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockUsersPageRoutingModule } from './block-users-routing.module';

import { BlockUsersPage } from './block-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockUsersPageRoutingModule
  ],
  declarations: [BlockUsersPage]
})
export class BlockUsersPageModule {}
