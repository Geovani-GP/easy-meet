import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { TabsPage } from './tabs.page';
import { RegisterUserPage } from '../register-user/register-user.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'create-meeting',
        loadChildren: () => import('../create-meeting/create-meeting.module').then(m => m.CreateMeetingPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'register-user',
        loadChildren: () => import('../register-user/register-user.module').then(m => m.RegisterUserPageModule)
      },
      {
        path: '',
        redirectTo: 'tab2', 
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
