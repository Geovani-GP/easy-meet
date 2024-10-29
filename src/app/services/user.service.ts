import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor() {
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
}
