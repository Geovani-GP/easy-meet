import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearInteresesPageRoutingModule } from './crear-intereses-routing.module';

import { CrearInteresesPage } from './crear-intereses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearInteresesPageRoutingModule
  ],
  declarations: [CrearInteresesPage]
})
export class CrearInteresesPageModule {}
