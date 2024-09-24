import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  intereses: any[] = [];
  selectedInterestsIds: string = '';
  isLoading: boolean = false; // Variable para controlar el spinner

  constructor(private router: Router,private spinnerService: SpinnerService, private servicesService: ServicesService) {}

  ngOnInit() {
    this.loadInterests();
  }

  findMeet() {
    this.selectedInterestsIds = this.getSelectedInterests();
    this.spinnerService.show();  // Mostrar spinner
    this.servicesService.findMeet(this.selectedInterestsIds, this.lowerValue, this.upperValue, this.selectedDate).subscribe(
      (response) => {
         this.spinnerService.hide(); // Ocultar spinner
        this.router.navigate(['/search-results'], { state: { searchResults: response.payload } });
      },
      (error) => {
         this.spinnerService.hide(); // Ocultar spinner
        console.error('Error en findMeet:', error);
      }
    );
  }

  loadInterests() {
    this.spinnerService.show();  // Mostrar spinner
    this.servicesService.getInterests().subscribe(
      (response) => {
         this.spinnerService.hide(); // Ocultar spinner
        if (response.payload && Array.isArray(response.payload)) {
          this.intereses = response.payload.map((interest: any) => ({
            id: interest.id,
            name: interest.interes, 
            selected: false
          }));
        } else {
          console.error('La respuesta no contiene payloads o no es un arreglo:', response);
        }
      },
      (error) => {
         this.spinnerService.hide(); // Ocultar spinner
        console.error('Error al cargar intereses:', error);
      }
    );
  }

  getSelectedInterests() {
    const selectedInterests = this.intereses.filter(interest => interest.selected);
    if (selectedInterests.length === 0) {
      const allInterestsIds = this.intereses.map(interest => interest.id).join(',');
      return allInterestsIds;
    } else {
      const selectedInterestsIds = selectedInterests.map(interest => interest.id).join(',');
      console.log('IDs de intereses seleccionados:', selectedInterestsIds);
      return selectedInterestsIds;
    }
  }

  rangeValues: { lower: number; upper: number } = { lower: 0, upper: 100 }; 
  lowerValue: number = this.rangeValues.lower; 
  upperValue: number = this.rangeValues.upper; 


  updateValues() {
    this.lowerValue = this.rangeValues.lower; 
    this.upperValue = this.rangeValues.upper; 
  }
  selectedDate: string = new Date().toISOString(); 
  isDatePickerVisible: boolean = false;

  showDatePicker() {
    console.log('showDatePicker');
    this.isDatePickerVisible = !this.isDatePickerVisible; 
    console.log('showDatePicker', this.isDatePickerVisible); 
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value; 
    this.isDatePickerVisible = false; 
  }

  buscar() {
    
    this.router.navigate(['/search-results']);
  }
}
