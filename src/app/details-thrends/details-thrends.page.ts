import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-thrends',
  templateUrl: './details-thrends.page.html',
  styleUrls: ['./details-thrends.page.scss'],
})
export class DetailsThrendsPage {
  id: number = 0;
  // Aquí puedes agregar más propiedades para almacenar los detalles del trend

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // Obtiene el ID del trend
      this.loadDetails(this.id); // Carga los detalles del trend
    });
  }

  loadDetails(id: number) {
    // Aquí puedes implementar la lógica para cargar los detalles del trend según el ID
    console.log('Cargando detalles para el trend con ID:', id);
  }

  contactar() {
    // Implementa la lógica para contactar
    console.log('Contactar');
  }
}
