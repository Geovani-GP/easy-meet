import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  hasSeenSplash: boolean = false;

  constructor(private router: Router, private platform: Platform) {
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
    this.platform.ready().then(() => {
      this.requestPushNotificationPermission();
    });
  }

  async requestPushNotificationPermission() {
    if (this.platform.is('cordova')) {
      const result = await PushNotifications['requestPermission'](); // Cambiado para acceder con corchetes
      if (result.granted) {
        await PushNotifications['register'](); // Acceso corregido con corchetes
      }
    }
  }
}
