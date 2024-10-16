import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular'; 
import { ServicesService } from '../services/services.service'; 

@Component({
  selector: 'app-asistencias-detalle',
  templateUrl: './asistencias-detalle.page.html',
  styleUrls: ['./asistencias-detalle.page.scss'],
})
export class AsistenciasDetallePage implements OnInit {
  assistance: any; 
  motivo: string = ''; 
  isModalOpen: boolean = false; 

  constructor(private router: Router, private modalController: ModalController, private servicesService: ServicesService) { } 

  ngOnInit() {
    this.assistance = history.state.assistance;
    console.log(this.assistance); 
  }

  async openCancelModal() {
    console.log('Abriendo modal...');
    this.isModalOpen = true; 
  }

  confirm() {
    console.log('Confirmando con motivo:', this.motivo);
    this.cancelAssistance(this.motivo); 
    this.isModalOpen = false; 
  }

  cancelAssistance(motivo: string) {
    const solicitud = this.assistance.solicitud;
    console.log(solicitud);
    const meetId = this.assistance.uid; 
    console.log(meetId);
    const usuarioId = localStorage.getItem('uid'); 
    console.log(usuarioId);
    if (solicitud && meetId && usuarioId) {
      const data = {
        solicitud: solicitud,
      /*   meet: meetId,
        usuario: usuarioId, */
        motivo: motivo
      };

      this.servicesService.cancelAssistance(data).subscribe({
        next: (response) => {
          console.log('Asistencia cancelada:', response);
          
        },
        error: (error) => {
          console.error('Error al cancelar la asistencia:', error);
        }
      });
    } else {
      console.error('ID de reunión o usuario no disponible.');
    }
  }
}
