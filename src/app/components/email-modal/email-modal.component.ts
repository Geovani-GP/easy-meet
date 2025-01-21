import { Component, Inject } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServicesService } from 'src/app/services/services.service';
import { TranslationService } from '../../services/translation.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-email-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{translate('ingresar-correo-electronico')}}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">{{translate('cerrar')}}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label position="floating">{{translate('correo-electronico')}}</ion-label>
        <ion-input [(ngModel)]="email" type="email"></ion-input>
      </ion-item>
      <ion-button expand="full" (click)="submitEmail()">{{translate('enviar')}}</ion-button>
    </ion-content>
  `
})
export class EmailModalComponent {
  email: string = '';
  uid: string;

  constructor(
    private modalController: ModalController,
    private translationService: TranslationService,
    private servicesService: ServicesService,
    private navParams: NavParams,
    private toastController: ToastController,
  ) {
    this.uid = this.navParams.get('uuid');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  submitEmail() {
    this.servicesService.appleEmail(this.uid, this.email).subscribe(
      async response => {

        const toast = await this.toastController.create({
          message: 'Actualización de correo exitosa.',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.dismiss();
      },
      error => {
        console.error('Error al enviar el correo:', error);
      }
    );
  }
}
