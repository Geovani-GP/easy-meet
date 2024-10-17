import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundImageDirective } from '../directives/background-image.directive';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';

@NgModule({
  declarations: [BackgroundImageDirective, SafeUrlPipe],
  imports: [CommonModule],
  exports: [BackgroundImageDirective, SafeUrlPipe]
})
export class SharedModule { }
