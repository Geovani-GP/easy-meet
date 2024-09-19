import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsThrendsPageRoutingModule } from './details-thrends-routing.module';

import { DetailsThrendsPage } from './details-thrends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsThrendsPageRoutingModule
  ],
  declarations: [DetailsThrendsPage]
})
export class DetailsThrendsPageModule {}
