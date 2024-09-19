import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciasDetallePageRoutingModule } from './asistencias-detalle-routing.module';

import { AsistenciasDetallePage } from './asistencias-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciasDetallePageRoutingModule
  ],
  declarations: [AsistenciasDetallePage]
})
export class AsistenciasDetallePageModule {}
