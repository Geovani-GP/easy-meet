import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash', // Redirige al splash screen al inicio
    pathMatch: 'full'
  },
  {
    path: 'splash', // Asegúrate de que esta ruta esté configurada
    loadChildren: () => import('./splash-screen/splash-screen.module').then(m => m.SplashScreenModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) // Ruta a las tabs
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


  // Otras rutas...
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
