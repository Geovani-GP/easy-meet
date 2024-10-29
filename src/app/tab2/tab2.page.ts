import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  
  trends: any[] = []; 
  currentPage: number = 1; 
  hasMoreData: boolean = true; 
  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private apiService: ServicesService,
    private translationService: TranslationService
  ) {}

  async ionViewWillEnter() {
    await this.loadTrends(); 
  }

  async refreshData(event: any) {
    this.currentPage = 1; 
    await this.loadTrends(); 
    event.target.complete(); 
  }
  async ngOnInit() { 
    this.loadTrends(); 
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  loadTrends() {
    this.spinnerService.show(); 
    this.apiService.getTrends(this.currentPage).subscribe(
      (response) => {
        this.trends = response.payload; 
        this.hasMoreData = this.trends.length > 0; 
        this.spinnerService.hide(); 
      },
      (error) => {
        console.error('Error al obtener tendencias en Tab2:', error); 
        this.spinnerService.hide(); 
      }
    );
  }

  loadMoreData(event: any) {
    this.currentPage++; 
    this.spinnerService.show(); 
    this.apiService.getTrends(this.currentPage).subscribe(
      (response) => {
        const newTrends = response.payload; 
        this.trends = [...this.trends, ...newTrends]; 
        this.hasMoreData = newTrends.length > 0; 
        event.target.complete(); 
        if (newTrends.length === 0) {
          event.target.disabled = true; 
        }
        this.spinnerService.hide(); 
      },
      (error) => {
        console.error('Error al cargar más tendencias:', error);
        event.target.complete(); 
        this.spinnerService.hide(); 
      }
    );
  }

  navigateToDetails(trend: any) {
    localStorage.setItem('selectedTrend', JSON.stringify(trend)); 
    this.router.navigate(['/details-thrends']); 
  }
}
