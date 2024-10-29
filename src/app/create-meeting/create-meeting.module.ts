import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateMeetingPageRoutingModule } from './create-meeting-routing.module';
import { CreateMeetingPage } from './create-meeting.page';
import { SharedModule } from '../shared/shared.module';
import { SpinnerModule } from '../spinner/spinner.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMeetingPageRoutingModule,
    SharedModule,
    SpinnerModule
  ],
  declarations: [CreateMeetingPage]
})
export class CreateMeetingPageModule {}
