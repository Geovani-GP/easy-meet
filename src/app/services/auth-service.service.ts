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
    localStorage.removeItem('oauth'); // Eliminar el estado de autenticación
    localStorage.removeItem('uid'); // Opcional: eliminar el UID
    localStorage.removeItem('userData'); // Opcional: eliminar los datos del usuario
  }
}
