import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash', 
    pathMatch: 'full'
  },
  {
    path: 'splash', 
    loadChildren: () => import('./splash-screen/splash-screen.module').then(m => m.SplashScreenModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) 
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'create-meeting',
    loadChildren: () => import('./create-meeting/create-meeting.module').then( m => m.CreateMeetingPageModule)
  },
  {
    path: 'details-thrends',
    loadChildren: () => import('./details-thrends/details-thrends.module').then( m => m.DetailsThrendsPageModule)
  },
  {
    path: 'search-results',
    loadChildren: () => import('./search-results/search-results.module').then( m => m.SearchResultsPageModule)
  },
  {
    path: 'reuniones-detalle',
    loadChildren: () => import('./reuniones-detalle/reuniones-detalle.module').then( m => m.ReunionesDetallePageModule)
  },
  {
    path: 'asistencias-detalle',
    loadChildren: () => import('./asistencias-detalle/asistencias-detalle.module').then( m => m.AsistenciasDetallePageModule)
  },
  {
    path: 'crear-intereses',
    loadChildren: () => import('./crear-intereses/crear-intereses.module').then( m => m.CrearInteresesPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },  {
    path: 'register-user',
    loadChildren: () => import('./register-user/register-user.module').then( m => m.RegisterUserPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
