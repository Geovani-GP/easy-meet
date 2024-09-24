import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SearchResultsPageRoutingModule } from './search-results-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SearchResultsPage } from './search-results.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SearchResultsPageRoutingModule,
    ExploreContainerComponentModule,
    MatCardModule, 
    MatButtonModule
  ],
  declarations: [SearchResultsPage]
})
export class SearchResultsPageModule {}
