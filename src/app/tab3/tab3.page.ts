import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(private router: Router, private spinnerService: SpinnerService) {}

  navigateToTab4(event: Event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    this.spinnerService.show(); // Muestra el spinner
    // Simulación de carga
    setTimeout(() => {
      this.router.navigate(['/tabs/tab4']); // Navega a Tab4 después de 3 segundos
      this.spinnerService.hide(); // Oculta el spinner
    }, 3000);
  }

  loadData() {
    this.spinnerService.show(); // Muestra el spinner
    // Simulación de carga
    setTimeout(() => {
      this.spinnerService.hide(); // Oculta el spinner después de 3 segundos
    }, 3000);
  }

  ngOnInit() {
    this.loadTrends(); // Llama a la función al inicializar el componente
  }

  loadTrends() {
    this.spinnerService.show(); // Muestra el spinner
    // Simulación de carga
    setTimeout(() => {
      this.spinnerService.hide(); // Oculta el spinner después de 3 segundos
    }, 3000);
  }

}
