import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPageRoutingModule,
    NgxStripeModule.forRoot('pk_test_51PHbVtP5EhZ3kVv2zN2k2KX872DDWL2wZxaFw704yFYTkvQZNORDy7oJvHECv27ioyvfpmColwI7k4EFKzBQ6guL00Hg0msNKb')
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}
