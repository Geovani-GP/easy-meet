import { Component } from '@angular/core';

@Component({
  selector: 'app-reuniones-detalle',
  templateUrl: './reuniones-detalle.page.html',
  styleUrls: ['./reuniones-detalle.page.scss'],
})
export class ReunionesDetallePage {
  selectedTab: string = 'pendientes';
  isModalOpen: boolean = false;
  selectedUser: any;

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  openModal(alias: string, image: string, status: string) {
    this.selectedUser = { alias, image, status };
    this.isModalOpen = true;
  }

  confirmar() {
    // Lógica para confirmar
    this.isModalOpen = false;
  }

  cancelar() {
    // Lógica para cancelar
    this.isModalOpen = false;
  }

  contactar() {
    // Lógica para contactar
    this.isModalOpen = false;
  }
}
