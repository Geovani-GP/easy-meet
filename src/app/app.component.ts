import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';
import { 
  AppTrackingTransparency, 
  AppTrackingStatusResponse 
} from 'capacitor-plugin-app-tracking-transparency';
import { AuthServiceService } from './services/auth-service.service';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  hasSeenSplash: boolean = false;

  constructor(private router: Router, private platform: Platform, private authService: AuthServiceService, private userServices : UserService) {
    this.initializeApp();
  }

  initializeApp() {
    document.body.setAttribute('color-mode', 'light');
    this.handleOAuth();
    this.platform.ready().then(() => {
      this.requestPushNotificationPermission();
      this.handleTrackingTransparency(); // Solicitar permisos de tracking

      if (this.authService.isAuthenticated()) {
        this.userServices.requestPermission();
        this.userServices.refreshTokenFCM();
      }
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

  async handleTrackingTransparency() {
    try {
      const deviceInfo = await Device.getInfo();

      if (deviceInfo.platform === 'ios') {
        console.log('Verificando estado de App Tracking Transparency en iOS');
        const statusResponse: AppTrackingStatusResponse = await this.getTrackingStatus();

        if (statusResponse.status === 'notDetermined') {
          console.log('El usuario aún no ha decidido. Solicitando permiso...');
          await this.requestTrackingPermission();
        } else {
          console.log('Estado actual del permiso:', statusResponse.status);
        }
      } else {
        console.log('Tracking no requiere permisos explícitos en esta plataforma.');
      }
    } catch (error) {
      console.error('Error al manejar el estado de tracking transparency:', error);
    }
  }

  async getTrackingStatus(): Promise<AppTrackingStatusResponse> {
    const response = await AppTrackingTransparency.getStatus();
    console.log('Estado del permiso de seguimiento:', response);
    return response;
  }

  async requestTrackingPermission(): Promise<AppTrackingStatusResponse> {
    const response = await AppTrackingTransparency.requestPermission();
    console.log('Resultado de la solicitud de permiso de seguimiento:', response);
    return response;
  }
}
