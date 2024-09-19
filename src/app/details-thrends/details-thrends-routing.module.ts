import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsThrendsPage } from './details-thrends.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsThrendsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsThrendsPageRoutingModule {}
