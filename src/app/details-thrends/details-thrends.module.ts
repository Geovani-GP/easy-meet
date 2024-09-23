import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from '../spinner/spinner.module';
import { IonicModule } from '@ionic/angular';

import { DetailsThrendsPageRoutingModule } from './details-thrends-routing.module';

import { DetailsThrendsPage } from './details-thrends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsThrendsPageRoutingModule,
    SpinnerModule
  ],
  declarations: [DetailsThrendsPage]
})
export class DetailsThrendsPageModule {}
