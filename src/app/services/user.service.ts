import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { ServicesService } from './services.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor(private services: ServicesService) {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    const userData = localStorage.getItem('EMUser');
    console.log("US", userData);
    if (userData) {
      this.userDataSubject.next(JSON.parse(userData));
    } else {
      this.userDataSubject.next(null);
    }
  }

  async updateUserData(newData: any) {
    const currentData = this.userDataSubject.getValue();
    const updatedData = { ...currentData, ...newData };
    await localStorage.setItem('EMUser', JSON.stringify(updatedData));
    this.userDataSubject.next(updatedData);
  }

  updateUserPhoto(userId: number, base64Image: string) {
    // Aquí puedes implementar la lógica para actualizar la foto de perfil en la base de datos
    console.log('Actualizando foto de perfil para el usuario con ID:', userId);
    console.log('Nueva foto de perfil:', base64Image);
  }

  async requestPermission() {
    const permission = await FirebaseMessaging.requestPermissions();
    if (permission.receive === 'granted') {
      this.getToken();
    }
  }

  async getToken() {
    try {
      const uid = localStorage.getItem('uid');
      const { token } = await FirebaseMessaging.getToken();
      console.log('Token FCM....:', token);
      this.services.registerTokenWithUser(token, uid).subscribe((res) => {
        console.log("resT", res);
      })
    } catch (error) {
      console.error('Error obteniendo token FCM:', error);
    }
  }

  refreshTokenFCM() {
    const uid = localStorage.getItem('uid');
    FirebaseMessaging.addListener('notificationReceived', () => { });

    FirebaseMessaging.addListener('tokenReceived', (token:any) => {
      console.log('Token refresh--:', token);
      this.services.registerTokenWithUser(token, uid).subscribe((res) => {
        console.log("resT", res);
      })
    });
  }
}
