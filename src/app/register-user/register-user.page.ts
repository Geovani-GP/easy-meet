import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslationService } from '../services/translation.service';
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {
  selectedDate: string = new Date().toISOString(); 
  isDatePickerVisible: boolean = false;
  email: string = '';
  password: string = '';
  nombre: string = '';
  telefono: string = '';
  sexo: string = 'M';
  pais: string = '52'; 
  currentStep: number = 1;
  summaryData: any;

  constructor(private spinnerService: SpinnerService, private servicesService: ServicesService, private toastController: ToastController, private router: Router, private translationService: TranslationService) { }

  ngOnInit() {}

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  async register() {
    this.spinnerService.show();
    this.summaryData = {
      identificador: this.email,
      nombre: this.nombre,
      telefono: this.pais + this.telefono,
      sexo: this.sexo,
      fec_nacimiento: this.selectedDate
    };

    this.showSummary();
  }

  showSummary() {
  }

  nextStep() {
    if (this.currentStep < 6) { 
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  showDatePicker() {
    this.isDatePickerVisible = !this.isDatePickerVisible;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  acceptDate() {
    this.isDatePickerVisible = false;
  }
}
