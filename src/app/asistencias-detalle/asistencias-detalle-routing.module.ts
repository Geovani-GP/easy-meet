import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistenciasDetallePage } from './asistencias-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: AsistenciasDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciasDetallePageRoutingModule {}
