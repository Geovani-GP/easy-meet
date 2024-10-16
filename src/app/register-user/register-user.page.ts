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
  sexo: string = 'M';
  pais: string = '52'; 

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
    this.spinnerService.show(); // Mostrar el spinner

    const data = {
      identificador: this.email,
      password: this.password,
      nombre: this.nombre,
      proveedor: 'email',
      sexo: this.sexo,
      fec_nacimiento: this.selectedDate,
      telefono: this.pais + this.telefono,
      dispositivo: {
        marca: 'google',
        modelo: 'Android SDK built for x86',
        veros: '8.0.0',
        versdk: 26,
        verapp: '4.0.0',
        token: localStorage.getItem('deviceToken') || ''
      }
    };

    this.servicesService.registerUser(data).subscribe({
      next: async (response) => {
        this.spinnerService.hide();
        const toast = await this.toastController.create({
          message: 'Registro exitoso!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/login']);
      },
      error: async (error) => {
        this.spinnerService.hide();
        console.log(error.message);
        const toast = await this.toastController.create({
          message: 'Error en el registro: verifica los datos',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  showDatePicker() {
    this.isDatePickerVisible = !this.isDatePickerVisible;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.isDatePickerVisible = false;
  }
}
