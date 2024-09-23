import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-details-thrends',
  templateUrl: './details-thrends.page.html',
  styleUrls: ['./details-thrends.page.scss'],
})
export class DetailsThrendsPage implements OnInit {
  id: number = 0;
  trendDetails: any;
  uid: string | undefined;
  trend: any;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute,
    private apiService: ServicesService,
    private spinnerService: SpinnerService) {
    this.trend = JSON.parse(localStorage.getItem('selectedTrend') || '{}');
  }
  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid') as string; 
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

  contactar() {
    console.log('Contactar');
  }
}
