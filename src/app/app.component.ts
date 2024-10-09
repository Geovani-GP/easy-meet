import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  hasSeenSplash: boolean = false;

  constructor(private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    document.body.setAttribute('color-mode', 'light');
    const oauthValue = localStorage.getItem('oauth');
    if (oauthValue === 'true') {
      this.router.navigate(['/tabs/tab4']); 
    } else {
      this.router.navigate(['/tabs/tab3']); 
    }
  }
}
