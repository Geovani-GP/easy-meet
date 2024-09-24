import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  searchResults: any[] = [];
  trends: any[] = []; 
  hasMoreData: boolean = true;

  constructor(private router: Router, private spinnerService: SpinnerService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.searchResults = navigation.extras.state['searchResults'];
      this.trends = this.searchResults; 
    }
  }

  ngOnInit() {
    console.log('Resultados de búsqueda:', this.searchResults);
    this.hasMoreData = this.trends.length > 0;
  }

  verDetalles() {
    this.router.navigate(['/details-thrends']); 
  }

  navigateToDetails(trend: any) {
    localStorage.setItem('selectedTrend', JSON.stringify(trend)); 
    this.router.navigate(['/details-thrends']); 
  }

  loadMoreData(event: any) {
    this.spinnerService.show(); 
    
    event.target.complete();
  }
}
