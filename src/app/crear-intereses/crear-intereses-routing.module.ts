import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearInteresesPage } from './crear-intereses.page';

const routes: Routes = [
  {
    path: '',
    component: CrearInteresesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearInteresesPageRoutingModule {}
