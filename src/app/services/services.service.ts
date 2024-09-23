import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = 'http://nni.com.mx:3200'; 
  /* private apiUrl = '/api'; */
 /*  private apiUrl = '/api';  */
  detailUrl: any;

  constructor(private http: HttpClient) {}

  getTrends(page: number): Observable<any> {
    const headers = new HttpHeaders({
      'ApiKey': '_$4DM1N$_',
    });

    return this.http.get(`${this.apiUrl}/meet/trend?page=${page}`, { headers, observe: 'response' }).pipe(
      map((response) => {
        // Validar el código de respuesta
        if (response.status === 200) {
          const body = response.body as { payload?: any[] };
          // Validar la estructura de la respuesta
          if (body && body.payload && Array.isArray(body.payload)) {
            return body; // Retorna la respuesta si es válida
          } else {
            throw new Error('Estructura de respuesta inválida'); // Lanza un error si la estructura no es válida
          }
        } else {
          throw new Error(`Error en la solicitud: ${response.status}`); // Lanza un error si el código de respuesta no es 200
        }
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error); // Manejo de errores
        return throwError(error); // Lanza el error para que pueda ser manejado en el componente
      })
    );
  }

  getTrendDetails(uid: string): Observable<any> {
    const headers = new HttpHeaders({
      'ApiKey': '_$4DM1N$_',
    });

    return this.http.get(`${this.apiUrl}/meet/detail?uid=${uid}`, { headers, observe: 'response' }).pipe(
      map((response) => {
        // Validar el código de respuesta
        if (response.status === 200) {
          const body = response.body;
          // Validar la estructura de la respuesta
          if (body) {
            return body; // Retorna la respuesta si es válida
          } else {
            throw new Error('Estructura de respuesta inválida'); // Lanza un error si la estructura no es válida
          }
        } else {
          throw new Error(`Error en la solicitud: ${response.status}`); // Lanza un error si el código de respuesta no es 200
        }
      }),
      catchError((error) => {
        console.error('Error en la solicitud de detalles:', error); // Manejo de errores
        return throwError(error); // Lanza el error para que pueda ser manejado en el componente
      })
    );
  }
}


