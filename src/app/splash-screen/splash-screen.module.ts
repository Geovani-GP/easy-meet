import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SplashScreenComponent } from './splash-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Agrega esta importación

@NgModule({
  declarations: [SplashScreenComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [SplashScreenComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  
})
export class SplashScreenModule { }
