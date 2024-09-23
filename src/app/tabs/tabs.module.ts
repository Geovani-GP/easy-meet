import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { MatButtonModule } from '@angular/material/button';
  import { MatCardModule } from '@angular/material/card';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    MatCardModule, // Asegúrate de incluirlo aquí
    MatButtonModule, // Incluye otros módulos que necesites
    TabsPageRoutingModule // Asegúrate de importar el módulo de rutas
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
