import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import * as firebase from 'firebase/compat';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private http = inject(HttpClient);
  private afAuth = inject(AngularFireAuth);
  private afMessaging = inject(AngularFireMessaging);

  private apiUrl = 'https://nni-easyment-agbuhma0gcetb4e0.canadacentral-01.azurewebsites.net'
  
 

  detailUrl: any;

  constructor() {
   this.getDeviceToken();
  }

  
  getTrends(page: number): Observable<any> {
    const headers = new HttpHeaders({
      'ApiKey': '_$4DM1N$_',
    });

    return this.http.get(`${this.apiUrl}/meet/trend?page=${page}`, { headers, observe: 'response' }).pipe(
      map((response) => {
        
        if (response.status === 200) {
          const body = response.body as { payload?: any[] };
          
          if (body && body.payload && Array.isArray(body.payload)) {
            return body; 
          } else {
            throw new Error('Estructura de respuesta inválida'); 
          }
        } else {
          throw new Error(`Error en la solicitud: ${response.status}`); 
        }
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error); 
        return throwError(error); 
      })
    );
  }
  
  getTrendDetails(uid: string): Observable<any> {
    const headers = new HttpHeaders({
      'ApiKey': '_$4DM1N$_',
    });

    return this.http.get(`${this.apiUrl}/meet/detail?uid=${uid}`, { headers, observe: 'response' }).pipe(
      map((response) => {
        
        if (response.status === 200) {
          const body = response.body;
          
          if (body) {
            return body; 
          } else {
            throw new Error('Estructura de respuesta inválida'); 
          }
        } else {
          throw new Error(`Error en la solicitud: ${response.status}`); 
        }
      }),
      catchError((error) => {
        console.error('Error en la solicitud de detalles:', error); 
        return throwError(error); 
      })
    );
  }
  
  findMeet(int: string, iniEdad: number, finEdad: number, fecha: string): Observable<any> {
    const headers = new HttpHeaders({
      'ApiKey': '_$4DM1N$_',
    });

    const params = new URLSearchParams({
      int,
      ini_edad: iniEdad.toString(),
      fin_edad: finEdad.toString(),
      fecha
    });

    return this.http.get(`${this.apiUrl}/meet/find?${params.toString()}`, { headers, observe: 'response' }).pipe(
      map((response) => {
        
        if (response.status === 200) {
          const body = response.body;
          
          if (body) {
            return body; 
          } else {
            throw new Error('Estructura de respuesta inválida'); 
          }
        } else {
          throw new Error(`Error en la solicitud: ${response.status}`); 
        }
      }),
      catchError((error) => {
        console.error('Error en la solicitud de findMeet:', error); 
        return throwError(error); 
      })
    );
  }
  
  getInterests(): Observable<any> {
    const headers = new HttpHeaders({
      'ApiKey': '_$4DM1N$_',
    });

    return this.http.get(`${this.apiUrl}/usuarios/intereses`, { headers, observe: 'response' }).pipe(
      map((response) => {
        
        if (response.status === 200) {
          const body = response.body;
          
          if (body) {
            return body; 
          } else {
            throw new Error('Estructura de respuesta inválida'); 
          }
        } else {
          throw new Error(`Error en la solicitud: ${response.status}`); 
        }
      }),
      catchError((error) => {
        console.error('Error en la solicitud de intereses:', error); 
        return throwError(error); 
      })
    );
  }

 
loginWithEmail(email: string, password: string): Observable<any> {
  return new Observable(observer => {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(async userCredential => {
        if (userCredential.user) {
          console.log(userCredential.user);
          const user = userCredential.user;
          localStorage.setItem('uid', user.uid);
          localStorage.setItem('userData', JSON.stringify({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }));
          localStorage.setItem('oauth', 'true');
          observer.next(userCredential);
          observer.complete();
        }
      })
      .catch(error => {
        console.error("Error en el inicio de sesión:", error);
        observer.error("Error en el inicio de sesión: " + error.message);
      });
  });
}


loginWithGoogle(): Observable<any> {
  return new Observable(observer => {
    const auth = getAuth(); 
    const provider = new GoogleAuthProvider(); 
    signInWithPopup(auth, provider) 
      .then(result => {
        const user = result.user;
         localStorage.setItem('uid', user.uid); 
         localStorage.setItem('userData', JSON.stringify({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }));
          const uid = user.uid;
          const deviceToken = localStorage.getItem('deviceToken') || '';
          this.sendDeviceToken(uid, deviceToken).subscribe({
            next: (response) => {
              if (response) {
                localStorage.setItem('oauth', 'true'); 
              }
            },
            error: (error) => {
              console.error('Error al enviar el token del dispositivo:', error);
              if (error.status === 409) {
                localStorage.setItem('oauth', 'false'); 
              } else {
                localStorage.setItem('oauth', 'false'); 
              }
            }
          });
          observer.next(result);
          observer.complete();
      })
      .catch(error => {
        console.error('Error en el inicio de sesión con Google:', error);
        observer.error(error);
      });
  });
}


private getDeviceToken(): void {
  this.afMessaging.requestToken.subscribe(
  
    (token) => {
    localStorage.setItem('deviceToken', token!); 
    },
    (error) => {
      console.error('Error al obtener el token:', error);
    }
  );
}


recoverPassword(email: string): Observable<any> {
    return new Observable(observer => {
        this.afAuth.sendPasswordResetEmail(email)
            .then(() => {
                observer.next('Se ha enviado un correo para restablecer la contraseña.');
                observer.complete();
            })
            .catch(error => {
                console.error('Error al enviar el correo de recuperación:', error);
                observer.error('Error al enviar el correo de recuperación: ' + error.message);
            });
    });
}



public sendDeviceToken(uid: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'ApiKey': '_$4DM1N$_',
    });

    const body = {
        uid: uid,
        dispositivo: {
            marca: 'google', 
            modelo: 'Android SDK built for x86', 
            veros: '8.0.0', 
            versdk: 26, 
            verapp: '4.0.0', 
            token: token 
        }
    };

    return this.http.post(`${this.apiUrl}/usuarios/login`, body, { headers }).pipe(
        map((response) => {
            return response; 
        }),
        catchError((error) => {
            console.error('Error al enviar el token del dispositivo:', error); 
            return throwError(error); 
        })
    );
}

getMyAssists(uid: string, page: number): Observable<any> {
  const headers = new HttpHeaders({
    'ApiKey': '_$4DM1N$_',
  });

  return this.http.get(`${this.apiUrl}/meet/myassists?uid=${uid}&page=${page}`, { headers, observe: 'response' }).pipe(
    map((response) => {
      if (response.status === 200) {
        const body = response.body;
        if (body) {
          return body; // Devuelve el cuerpo de la respuesta
        } else {
          throw new Error('Estructura de respuesta inválida');
        }
      } else {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
    }),
    catchError((error) => {
      console.error('Error en la solicitud de mis asistencias:', error);
      return throwError(error);
    })
  );
}

getMyMeetings(uid: string, page: number): Observable<any> {
  const headers = new HttpHeaders({
    'ApiKey': '_$4DM1N$_', // Asegúrate de usar la clave API correcta
  });

  return this.http.get(`${this.apiUrl}/meet/mymeetings?uid=${uid}&page=${page}`, { headers, observe: 'response' }).pipe(
    map((response) => {
      if (response.status === 200) {
        const body = response.body;
        if (body) {
          return body; // Devuelve el cuerpo de la respuesta
        } else {
          throw new Error('Estructura de respuesta inválida');
        }
      } else {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
    }),
    catchError((error) => {
      console.error('Error en la solicitud de mis reuniones:', error);
      return throwError(error);
    })
  );
}

}

