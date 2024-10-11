import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
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
          console.log(user);
          localStorage.setItem('uid', user.uid);
          localStorage.setItem('userData', JSON.stringify({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }));
          
          const deviceToken = localStorage.getItem('deviceToken') || '';
          const identificador = user.email;
          if (deviceToken && identificador) {
            this.sendDeviceToken(identificador, deviceToken).pipe(
              retry(3),
              catchError(error => {
                console.error("Error al enviar el token del dispositivo:", error);
                return throwError(() => new Error('Error al enviar el token del dispositivo'));
              })
            ).subscribe({
              next: (response) => {
                console.log("Respuesta de la API:", response);
                if (response && response.payload) {
                  console.log("UID:", response.payload.uid);
                  localStorage.setItem('uid', response.payload.uid); 
                } else {
                  console.warn("Respuesta inesperada:", response);
                }
                observer.next(userCredential);
                observer.complete();
              },
              error: (err) => {
                console.error("Error al procesar la respuesta de la API:", err);
                observer.error(err);
              }
            });
          } else {
            console.warn('Token del dispositivo o identificador no disponible.');
            observer.next(userCredential);
            observer.complete();
          }
        }
      }).catch(error => {
          console.error('Error en el inicio de sesión con Google:', error);
          observer.error(error);
        });
    });
  }


loginWithGoogle(): Observable<any> {
  return new Observable(observer => {
    const auth = getAuth(); 
    const provider = new GoogleAuthProvider(); 
    signInWithPopup(auth, provider) 
      .then(async result => {
        const user = result.user;
        const identificador = user.email;
        localStorage.setItem('uid', user.uid); 
        localStorage.setItem('userData', JSON.stringify({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
        localStorage.setItem('oauth', 'true'); 
        
        const deviceToken = localStorage.getItem('deviceToken') || '';
        
        if (deviceToken && identificador) {
          this.sendDeviceToken(identificador, deviceToken).pipe(
            retry(3),
            catchError(error => {
              console.error("Error al enviar el token del dispositivo:", error);
              return throwError(() => new Error('Error al enviar el token del dispositivo'));
            })
          ).subscribe({
            next: (response) => {
              console.log("Respuesta de la API:", response);
              if (response && response.payload) {
                console.log("UID:", response.payload.uid);
                localStorage.setItem('uid', response.payload.uid); 
              } else {
                console.warn("Respuesta inesperada:", response);
              }
              observer.next(result);
              observer.complete();
            },
            error: (err) => {
              console.error("Error al procesar la respuesta de la API:", err);
              observer.error(err);
            }
          });
        } else {
          console.warn('Token del dispositivo o identificador no disponible.');
          observer.next(result);
          observer.complete();
        }
      }).catch(error => {
        console.error('Error en el inicio de sesión con Google:', error);
        observer.error(error);
      });
  });
}


private sendIdentificadorToApi(uid: string, token: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ApiKey': '_$4DM1N$_',
  });

  const body = {
    identificador: uid,
    dispositivo: {
      token: token
    }
  };

  return this.http.post(`${this.apiUrl}/usuarios/login`, body, { headers }).pipe(
    map(response => response),
    catchError(error => {
      console.error('Error al enviar el identificador a la API:', error);
      return throwError(error);
    })
  );
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



private sendDeviceToken(identificador: string, token: string): Observable<any> {
  console.log(identificador, token);
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ApiKey': '_$4DM1N$_',
  });
console.log("datos:",identificador, token);
  if (!token || !identificador) {
    console.error('El token del dispositivo o el identificador es undefined o vacío.');
    return throwError(() => new Error('El token del dispositivo y el identificador son necesarios.'));
  }

  const body = {
    identificador: identificador,
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
      console.log('Respuesta exitosa del servidor:', response);
      if (response) {
        localStorage.setItem('EMUser', JSON.stringify(response)); 
      } else {
        console.warn("Respuesta inesperada:", response);
      }
      return response;
    }),
    catchError((error) => {
      console.error('Error al enviar el token del dispositivo:', error);
      if (error.error) {
        console.error("Detalles del error:", error.error);
      }
      return throwError(() => new Error('Error al enviar el token del dispositivo'));
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
          return body; 
        } else {
          throw new Error('Estructura de respuesta inválida');
        }
      } else {
        throw new Error(`Error en la solicitud de mis asistencias:`);
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
    'ApiKey': '_$4DM1N$_', 
  });

  return this.http.get(`${this.apiUrl}/meet/mymeetings?uid=${uid}&page=${page}`, { headers, observe: 'response' }).pipe(
    map((response) => {
      if (response.status === 200) {
        const body = response.body;
        if (body) {
          return body; 
        } else {
          throw new Error('Estructura de respuesta inválida');
        }
      } else {
        throw new Error(`Error en la solicitud de mis reuniones:`);
      }
    }),
    catchError((error) => {
      console.error('Error en la solicitud de mis reuniones:', error);
      return throwError(error);
    })
  );
}


registerUser(data: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ApiKey': '_$4DM1N$_',
  });

  return this.http.post(`${this.apiUrl}/usuarios/registro2`, data, { headers }).pipe(
    map(response => response),
    catchError(error => {
      console.error('Error en el registro:', error);
      return throwError(error);
    })
  );
}

  saveInterests(uid: string, selectedInterestsIds: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': '_$4DM1N$_',
    });

    const body = {
      uid: uid,
      intereses: selectedInterestsIds.map(id => parseInt(id))
    };

    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/usuarios/intereses`, body, { headers }).pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          console.error('Error al guardar intereses:', error);
          return throwError(error);
        })
      ).subscribe({
        next: (response) => {
          console.log('Intereses guardados exitosamente:', response);
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          console.error('Error al guardar intereses:', err);
          observer.error(err);
        }
      });
    });
  }

}