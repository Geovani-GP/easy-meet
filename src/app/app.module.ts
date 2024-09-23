import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashScreenModule } from './splash-screen/splash-screen.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SpinnerModule } from './spinner/spinner.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SplashScreenModule,
    IonicStorageModule.forRoot(),
    SpinnerModule,
    HttpClientModule, // Asegúrate de importar HttpClientModule
    // otros módulos
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAnimationsAsync(),
    // otros proveedores
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
