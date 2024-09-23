import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    SpinnerModule,
    MatCardModule, // Asegúrate de incluirlo aquí
    MatButtonModule // Incluye otros módulos que necesites
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
