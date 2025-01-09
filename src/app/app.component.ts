import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';

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
    this.handleOAuth();
    this.platform.ready().then(() => {
      this.requestPushNotificationPermission();
      this.requestTrackingPermission(); // Llamada a la función de tracking
    });
  }

  handleOAuth() {
    const oauthValue = localStorage.getItem('oauth');
    const targetRoute = oauthValue === 'true' ? '/tabs/tab4' : '/tabs/tab3';
    this.router.navigate([targetRoute]);
  }

  async requestPushNotificationPermission() {
    try {
      if (this.platform.is('cordova')) {
        const result = await PushNotifications.requestPermissions();
        if (result.receive === 'granted') {
          await PushNotifications.register();
          console.log('Permisos de notificaciones concedidos y registro completado');
        } else {
          console.warn('Permisos de notificaciones no concedidos');
        }
      }
    } catch (error) {
      console.error('Error al solicitar permisos de notificaciones:', error);
    }
  }

  async requestTrackingPermission() {
    try {
      const info = await Device.getInfo();
      if (info.platform === 'ios') {
        console.log('Verificando permisos de seguimiento en iOS');
        // El usuario debe habilitar manualmente el tracking en la configuración de iOS
        console.warn(
          'El tracking en iOS debe activarse manualmente por el usuario en Configuración.'
        );
      } else {
        // En Android, no se requiere permiso explícito para el tracking
        console.log('Tracking habilitado automáticamente en Android.');
      }
    } catch (error) {
      console.error('Error al verificar plataforma y tracking:', error);
    }
  }
}
