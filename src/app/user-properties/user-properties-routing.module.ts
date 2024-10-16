import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPropertiesPage } from './user-properties.page';

const routes: Routes = [
  {
    path: '',
    component: UserPropertiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPropertiesPageRoutingModule {}
