import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReunionesDetallePageRoutingModule } from './reuniones-detalle-routing.module';

import { ReunionesDetallePage } from './reuniones-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReunionesDetallePageRoutingModule
  ],
  declarations: [ReunionesDetallePage]
})
export class ReunionesDetallePageModule {}
