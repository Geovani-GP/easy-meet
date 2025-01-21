import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { SplashScreenModule } from './splash-screen/splash-screen.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStripeModule } from 'ngx-stripe';
import { EmailModalComponent } from './components/email-modal/email-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, EmailModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireMessagingModule,
    SplashScreenModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxStripeModule.forRoot('tu_clave_publica_de_stripe'),
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
