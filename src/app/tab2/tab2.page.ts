import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  trends: any[] = []; // Para almacenar los datos de tendencias
  currentPage: number = 1; // Página actual
  hasMoreData: boolean = true; // Indica si hay más datos para cargar

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private apiService: ServicesService
  ) {}

  ngOnInit() {
    this.loadTrends(); 
  }

  loadTrends() {
    this.spinnerService.show(); // Muestra el spinner
    this.apiService.getTrends(this.currentPage).subscribe(
      (response) => {
        this.trends = response.payload; // Almacena los datos de tendencias desde el payload
        this.hasMoreData = this.trends.length > 0; // Actualiza si hay más datos

        this.spinnerService.hide(); // Oculta el spinner
      },
      (error) => {
        console.error('Error al obtener tendencias en Tab2:', error); // Muestra el error en la consola
        this.spinnerService.hide(); // Asegúrate de ocultar el spinner en caso de error
      }
    );
  }

  loadMoreData(event: any) {
    this.currentPage++; // Incrementa la página actual
    this.apiService.getTrends(this.currentPage).subscribe(
      (response) => {
        const newTrends = response.payload; // Obtiene los nuevos datos
        this.trends = [...this.trends, ...newTrends]; // Agrega los nuevos datos a la lista existente
        this.hasMoreData = newTrends.length > 0; // Actualiza si hay más datos
        event.target.complete(); // Completa el evento de scroll infinito
        if (newTrends.length === 0) {
          event.target.disabled = true; // Desactiva el scroll infinito si no hay más datos
        }
      },
      (error) => {
        console.error('Error al cargar más tendencias:', error);
        event.target.complete(); // Completa el evento de scroll infinito incluso en caso de error
      }
    );
  }

  navigateToDetails(trend: any) {
    localStorage.setItem('selectedTrend', JSON.stringify(trend)); // Almacena el objeto en localStorage
    this.router.navigate(['/details-thrends']); // Navega a la página de detalles
  }
}
