import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  hasSeenSplash: boolean = false;

  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // Forzar el modo claro
    document.body.setAttribute('color-mode', 'light');
  }
}
