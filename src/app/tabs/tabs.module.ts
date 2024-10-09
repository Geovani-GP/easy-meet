import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment'; // Asegúrate de tener tu configuración de Firebase aquí
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SpinnerModule } from '../spinner/spinner.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { ServicesService } from '../services/services.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Cambiado de firebase a firebaseConfig
    AngularFireAuthModule,
    AngularFireMessagingModule,
    MatCardModule, 
    MatButtonModule, 
    TabsPageRoutingModule 
  ],
  declarations: [TabsPage],
  providers: [ServicesService]
})
export class TabsPageModule {}
