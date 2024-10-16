import { Component } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { TranslationService } from '../services/translation.service';
@Component({
  selector: 'app-reuniones-detalle',
  templateUrl: './reuniones-detalle.page.html',
  styleUrls: ['./reuniones-detalle.page.scss'],
})
export class ReunionesDetallePage {
  selectedTab: string = 'pendientes';
  isModalOpen: boolean = false;
  selectedUser: any;
  modalUser: any; 
  eventos: any[] = []; // Asegúrate de que esto sea un array

  constructor(private apiService: ServicesService, private translationService: TranslationService) {}

  ngOnInit() {
    this.selectedUser = history.state.meeting;
    console.log(this.selectedUser);
    this.getEventDetails(this.selectedUser.uid);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  getEventDetails(uid: string) {
    this.apiService.getEventDetails(uid).subscribe(response => {
        if (response.success) {
            this.eventos = response.payload; // Asigna el payload a eventos
            console.log(this.eventos); // Verifica que eventos tenga los datos esperados
        } else {
            console.error('Error en la respuesta:', response.message);
        }
    }, error => {
        console.error('Error al obtener los detalles del evento:', error);
    });
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  openModal(alias: string, image: string, status: string) {
    this.modalUser = { alias, image, status }; // Usar objeto temporal
    this.isModalOpen = true;
  }

  confirmar() {
    this.isModalOpen = false;
  }

  cancelar() {
    this.isModalOpen = false;
  }

  contactar() {
    this.isModalOpen = false;
  }
}
