import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { SpinnerService } from '../services/spinner.service';
import { ToastController } from '@ionic/angular';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-crear-intereses',
  templateUrl: './crear-intereses.page.html',
  styleUrls: ['./crear-intereses.page.scss'],
})
export class CrearInteresesPage implements OnInit {
  intereses: any[] = [];
  selectedInterestsIds: string = '';
  constructor(private servicesService: ServicesService, private spinnerService: SpinnerService, private toastController: ToastController, private translationService: TranslationService) { }

  ngOnInit() {
    this.loadInterests();
    this.loadSelectedInterests();
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  loadInterests() {
    this.spinnerService.show();  
    this.servicesService.getInterests().subscribe(
      (response) => {
        this.spinnerService.hide(); 
        if (response.payload && Array.isArray(response.payload)) {
          this.intereses = response.payload.map((interest: any) => ({
            id: interest.id,
            name: this.translate(interest.interes), 
            selected: false
          }));
          this.loadSelectedInterests(); 
        } else {
          console.error('La respuesta no contiene payloads o no es un arreglo:', response);
        }
      },
      (error) => {
        this.spinnerService.hide(); 
        console.error('Error al cargar intereses:', error);
      }
    );
  }

  loadSelectedInterests() {
    const userData = localStorage.getItem('EMUser');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const selectedInterests = parsedData.payload?.intereses || [];
      this.intereses.forEach(interest => {
        interest.selected = selectedInterests.includes(interest.id); 
      });
    }
  }

  toggleInterestSelection(interestId: string) {
    const interest = this.intereses.find(interest => interest.id === interestId);
    if (interest) {
      interest.selected = !interest.selected; 
    }
  }

  getSelectedInterests() {
    const selectedInterests = this.intereses.filter(interest => interest.selected);
    const selectedInterestsIds = selectedInterests.map(interest => interest.id);
    console.log('IDs de intereses seleccionados:', selectedInterestsIds);
    return selectedInterestsIds; 
  }

  async saveInterests() {
    const selectedInterestsIds = this.getSelectedInterests().map(id => Number(id));
    const uid = localStorage.getItem('uid');

    if (uid) {
      this.spinnerService.show();
      this.servicesService.saveInterests(uid, selectedInterestsIds.map(String)).subscribe({
        next: async (response) => {
          this.spinnerService.hide();
          console.log('Intereses guardados exitosamente:', response);

          
          const emUser = JSON.parse(localStorage.getItem('EMUser') || '{}');
          if (emUser && emUser.payload) {
            
            emUser.payload.intereses = selectedInterestsIds;
            localStorage.setItem('EMUser', JSON.stringify(emUser));
            console.log('EMUser actualizado:', emUser);
          } else {
            console.error('EMUser no tiene la estructura esperada');
          }

          const toast = await this.toastController.create({
            message: 'Intereses actualizados exitosamente.',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
        },
        error: async (err) => {
          this.spinnerService.hide();
          console.error('Error al guardar intereses:', err);
          
          const toast = await this.toastController.create({
            message: 'Error al actualizar los intereses. Inténtalo de nuevo.',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      });
    } else {
      console.warn('UID no disponible. No se pueden guardar los intereses.');
      const toast = await this.toastController.create({
        message: 'No se puede guardar los intereses sin un UID.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    }
  }

}
