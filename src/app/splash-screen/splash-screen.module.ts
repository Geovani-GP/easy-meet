import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SplashScreenComponent } from './splash-screen.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  declarations: [SplashScreenComponent],
  exports: [SplashScreenComponent]
})
export class SplashScreenModule { }
