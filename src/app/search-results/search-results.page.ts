import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage {
  

  constructor(private router: Router) {}

  ngOnInit() {
  }

  verDetalles() {
    this.router.navigate(['/details-thrends']); // Navega a la página de detalles
  }
}
