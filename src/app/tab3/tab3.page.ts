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
    event.preventDefault(); 
    this.spinnerService.show(); 
    
    setTimeout(() => {
      this.router.navigate(['/tabs/tab4']); 
      this.spinnerService.hide(); 
    }, 3000);
  }

  loadData() {
    this.spinnerService.show(); 
    
    setTimeout(() => {
      this.spinnerService.hide(); 
    }, 3000);
  }

  ngOnInit() {
    this.loadTrends(); 
  }

  loadTrends() {
    this.spinnerService.show(); 
    
    setTimeout(() => {
      this.spinnerService.hide(); 
    }, 3000);
  }

}
