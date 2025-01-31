import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockUsersPage } from './block-users.page';

const routes: Routes = [
  {
    path: '',
    component: BlockUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockUsersPageRoutingModule {}
