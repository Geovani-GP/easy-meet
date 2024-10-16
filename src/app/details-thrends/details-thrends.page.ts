import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { ToastController } from '@ionic/angular'; // Importar ToastController
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-details-thrends',
  templateUrl: './details-thrends.page.html',
  styleUrls: ['./details-thrends.page.scss'],
})
export class DetailsThrendsPage implements OnInit {
  id: number = 0;
  trendDetails: any;
  oauth: string | undefined;
  trend: any;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute,
    private apiService: ServicesService,
    private spinnerService: SpinnerService,
    private toastController: ToastController,
    private translationService: TranslationService) { // Inyectar ToastController
    this.trend = JSON.parse(localStorage.getItem('selectedTrend') || '{}');
  }
  ngOnInit() {
    this.oauth = localStorage.getItem('oauth') || '';
    this.loadTrendDetails(); 
  }

  loadTrendDetails() {
    this.spinnerService.show(); 
    if (this.trend) {
      console.log(this.trend)
      this.apiService.getTrendDetails(this.trend.uid).subscribe(
        (response) => {
          this.trendDetails = response.payload; 
          console.log('Detalles del trend:', this.trendDetails); 
          this.isLoading = false; 
          this.spinnerService.hide(); 
      },
      (error) => {
        console.error('Error al obtener detalles del trend:', error); 
        this.isLoading = false; 
        this.spinnerService.hide(); 
      }
    );
  }
}


translate(key: string): string {
  if (this.translationService && this.translationService.translate) {
    return this.translationService.translate(key);
  }
  console.warn('Translation service is not available');
  return key;
}

async contactar() {
  const uid = localStorage.getItem('uid') || '';
  if (this.oauth && uid) { // Verifica si el usuario está autenticado
    this.apiService.solicitarContacto(this.trend.uid, uid).subscribe(
      async (response) => {
        console.log('Solicitud de contacto enviada:', response);
        const toast = await this.toastController.create({
          message: 'Solicitud de contacto enviada con éxito.',
          duration: 2000,
          color: 'success' // Cambiado a 'success'
        });
        await toast.present();
      },
      async (error) => {
        console.error(error);
        const toast = await this.toastController.create({
          message: 'La solicitud ya fue registrada.',
          duration: 2000,
          color: 'danger' // Cambiado a 'danger' para indicar error
        });
        await toast.present();
      }
    );
  } else {
    console.warn('Usuario no autenticado. No se puede enviar la solicitud de contacto.');
    const toast = await this.toastController.create({
      message: 'Usuario no autenticado. No se puede enviar la solicitud de contacto.',
      duration: 2000,
      color: 'warning' // Cambiado a 'warning' para indicar advertencia
    });
    await toast.present();
  }
}
}
