import { Component } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { TranslationService } from '../services/translation.service';
import { ToastController } from '@ionic/angular';
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
  mostrarMotivoCancelacion: boolean = false;
  motivoCancelacion: string = '';

  constructor(private apiService: ServicesService, private translationService: TranslationService, private toastController: ToastController) {}

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

  openModal(solicitudId: string) {
    this.resetModal();
    console.log('ID de solicitud:', solicitudId);
    const event = this.eventos.find(e => e.solicitud === solicitudId); // Buscar el evento por solicitud
    console.log('Evento encontrado:', event); // Verifica la estructura del evento

    if (event) {
      console.log('Usuario:', event.usuario); // Verifica si el usuario está presente
      if (event.usuario) {
        this.modalUser = event; // Asignar el objeto de usuario a modalUser
        console.log('Modal User:', this.modalUser);
      } else {
        console.warn('No hay usuario disponible para este evento');
        this.modalUser = null; // Asignar null si no hay usuario
      }
    } else {
      console.error('Evento no encontrado para la solicitud:', solicitudId);
    }
    
    this.isModalOpen = true;
  }

  contactar(usuario: string) {
    this.isModalOpen = false;
    // Manejo de errores mejorado
    this.apiService.solicitarContacto(this.selectedUser.uid, usuario).subscribe(async response => {
      if (response.success) {
        const toast = await this.toastController.create({
          message: 'Solicitud de contacto enviada!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        console.log('Solicitud de contacto enviada:', response);
        location.reload(); 
      } else {
        const toast = await this.toastController.create({
          message: 'No se pudo enviar la solicitud de contacto!',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        console.error('Error en la respuesta al solicitar contacto:', response.message);
      }
    }, async error => {
      const toast = await this.toastController.create({
        message: 'No se pudo enviar la solicitud de contacto!',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      console.error('Error al enviar solicitud de contacto:', error);
    });
  }

  confirmar(usuario: string) {
    this.isModalOpen = false;
    // Manejo de errores mejorado
    this.apiService.confirmarContacto(usuario).subscribe(async response => {
      if (response.success) {
        const toast = await this.toastController.create({
          message: 'Contacto confirmado!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        console.log('Contacto confirmado:', response);
      } else {
        const toast = await this.toastController.create({
          message: 'No se pudo confirmar el contacto!',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        console.error('Error en la respuesta al confirmar contacto:', response.message);
      }
    }, async error => {
      const toast = await this.toastController.create({
        message: 'No se pudo confirmar el contacto!',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      console.error('Error al confirmar contacto:', error);
    });
  }

  cancelar(solicitudId: string, motivo: string) {
    this.isModalOpen = false;
    // Manejo de errores mejorado
    this.apiService.cancelAssistance({ solicitud: solicitudId, motivo }).subscribe(async response => {
      if (response.success) {
        const toast = await this.toastController.create({
          message: 'Asistencia cancelada!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        console.log('Asistencia cancelada:', response);
        // Recargar la página después de cancelar la asistencia
        location.reload(); // Agregado para recargar la página
      } else {
        console.error('Error en la respuesta al cancelar asistencia:', response.message);
      }
    }, async error => {
      const toast = await this.toastController.create({
        message: 'No se pudo cancelar la asistencia!',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      console.error('Error al cancelar asistencia:', error);
    });
  }

  resetModal() {
    this.mostrarMotivoCancelacion = false;
    this.motivoCancelacion = '';
  }

  
}
