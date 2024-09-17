import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {
  intereses = [
    { name: 'Arte Y Manualidades', selected: false },
    { name: 'Astrología Y Espiritualidad', selected: false },
    { name: 'Baile Y Danza', selected: false },
    { name: 'Bienestar Y Autocuidado', selected: false },
    { name: 'Cine Y Cineclubes', selected: false },
    { name: 'Clubes De Idiomas Y Intercambio Cultural', selected: false },
    { name: 'Cocina Y Gastronomía', selected: false },
    { name: 'Debate Y Discusión De Temas Actuales', selected: false },
    { name: 'Deportes Y Actividades Físicas', selected: false },
    { name: 'Ecología Y Sostenibilidad', selected: false },
    { name: 'Encuentros 1:1', selected: false },
    { name: 'Fotografía', selected: false },
    { name: 'Jardinería Y Horticultura', selected: false },
    { name: 'Juegos De Mesa Y Juegos De Rol', selected: false },
    { name: 'Lectura Y Clubes De Libros', selected: false },
    { name: 'Música Y Conciertos', selected: false },
    { name: 'Senderismo Y Actividades Al Aire Libre', selected: false },
    { name: 'Tecnología Y Programación', selected: false },
    { name: 'Viajes Y Aventuras', selected: false },
    { name: 'Yoga Y Meditación', selected: false },
  ];
  rangeValues: { lower: number; upper: number } = { lower: 0, upper: 100 }; // Valores iniciales
  lowerValue: number = this.rangeValues.lower; // Valor inferior
  upperValue: number = this.rangeValues.upper; // Valor superior


  
  updateValues() {
    this.lowerValue = this.rangeValues.lower; // Actualiza el valor inferior
    this.upperValue = this.rangeValues.upper; // Actualiza el valor superior
  }
  selectedDate: string = new Date().toISOString(); // Fecha inicial
  isDatePickerVisible: boolean = false;

  showDatePicker() {
    console.log('showDatePicker');
    this.isDatePickerVisible = !this.isDatePickerVisible; // Alternar visibilidad
    console.log('showDatePicker', this.isDatePickerVisible); // Verifica el estado
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value; // Actualizar la fecha seleccionada
    this.isDatePickerVisible = false; // Ocultar el date picker después de seleccionar
  }
}
