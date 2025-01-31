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
  selectedDate: string = new Date().toISOString(); // Fecha inicial
  isDatePickerVisible: boolean = false;
  email: string = '';
  password: string = '';
  nombre: string = '';
  telefono: string = '';
  sexo: string = 'X';
  pais: string = '52'; 
  isPrivacyModalOpen: boolean = false;
  isChecked: boolean = false;
  constructor(private spinnerService: SpinnerService, private servicesService: ServicesService, private toastController: ToastController, private router: Router, private translationService: TranslationService) { }

  ngOnInit() {}

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  openPrivacyModal() {
    this.isPrivacyModalOpen = true;
  }

  async register() {
    if (!this.isFormValid()) {
      const toast = await this.toastController.create({
        message: this.translate('por_favor_completa_todos_los_campos'),
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }
    this.spinnerService.show(); 

    const data = {
      identificador: this.email,
      password: this.password,
      nombre: this.nombre,
      proveedor: 'email',
      sexo: this.sexo || 'X',
      fec_nacimiento: this.selectedDate,
      telefono: this.pais + this.telefono
    };

    this.servicesService.registerUser2(data).subscribe({
      next: async (response) => {
        this.spinnerService.hide();
        if (response.success) {
          const toast = await this.toastController.create({
            message: this.translate('registro_exitoso'),
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.router.navigate(['/tabs/tab3']);
        } else {
          const toast = await this.toastController.create({
            message: this.translate('error_registro') + ': ' + response.message,
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      },
      error: async (error) => {
        this.spinnerService.hide();
        console.log(error.message);
        const toast = await this.toastController.create({
          message: this.translate('error_verifica_datos'),
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  isFormValid(): boolean {
    return this.nombre.trim() !== '' &&
           this.email.trim() !== '' &&
           this.telefono.trim() !== '' &&
           this.password.trim() !== '' &&
           this.isChecked;
  }

  showDatePicker() {
    this.isDatePickerVisible = !this.isDatePickerVisible;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  acceptDate() {
    this.isDatePickerVisible = false;
    console.log('Fecha seleccionada:', this.selectedDate);
  }
}
