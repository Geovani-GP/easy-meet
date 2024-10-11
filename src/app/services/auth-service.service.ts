import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor() {}

  isAuthenticated(): boolean {
    return localStorage.getItem('oauth') === 'true'; // Verifica el estado de autenticación
  }

  logout() {
    localStorage.removeItem('oauth');
    localStorage.removeItem('uid'); 
    localStorage.removeItem('userData'); 
    localStorage.removeItem('EMUser');
  }
}
