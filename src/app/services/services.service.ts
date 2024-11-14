import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, retry } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import * as firebase from 'firebase/compat';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private http = inject(HttpClient);
  private afAuth = inject(AngularFireAuth);
  private afMessaging = inject(AngularFireMessaging);
  private storage = inject(AngularFireStorage);
   //private apiUrl = 'https://nni-easyment-agbuhma0gcetb4e0.canadacentral-01.azurewebsites.net'
   private apiUrl = 'https://em1-gmbwh0hqa0gceedw.canadaeast-01.azurewebsites.net';
  
 

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

  loginWithEmail2(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(async userCredential => {
          if (userCredential.user) {
            const user = userCredential.user;
            console.log('Usuario autenticado:', user);
            
            try {
              const loginResponse = await this.loginEM(user.uid).toPromise();
              console.log('Respuesta de loginEM:', loginResponse);
              
              if (loginResponse && loginResponse.payload) {
                // Guardar los datos en localStorage
                localStorage.setItem('EMUser', JSON.stringify(loginResponse));
                localStorage.setItem('uid', loginResponse.payload.uid);
                
                // Emitir la respuesta completa
                observer.next(loginResponse);
                observer.complete();
              } else {
                observer.error('Respuesta inválida del servidor');
              }
            } catch (error) {
              console.error('Error en loginEM:', error);
              observer.error(error);
            }
          }
        })
        .catch(error => {
          console.error('Error en el inicio de sesión:', error);
          observer.error(error);
        });
    });
  }

loginEM(localId: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ApiKey': '_$4DM1N$_',
  });
  const body = {
    uid: localId
  };
  return this.http.post(`${this.apiUrl}/usuarios/loginf`, body, { headers }).pipe(
    map((response: any) => {
      console.log("services: ", response);
      localStorage.setItem('uid', response.payload.uid);
      localStorage.setItem('EMUser', JSON.stringify(response)); // Guardar la respuesta en localStorage
      return response; // Retornar la respuesta
    }),
    catchError(error => {
      console.error('Error al realizar el loginEM:', error);
      return throwError(error);
    })
  );
}

loginWithGoogle(): Observable<any> {
  return new Observable(observer => {
    const auth = getAuth(); 
    const provider = new GoogleAuthProvider(); 
    signInWithPopup(auth, provider) 
      .then(async result => {
        if (result.user) {
          const user = result.user;
          if (user && user.email) {
            console.log(user);
            this.loginEM(user.uid).subscribe(response => {
              if(response.statusCode === 409){
                console.error('Error en el inicio de sesión: usuario no encontrado.');
                observer.error('Usuario no encontrado.'); // Mensaje de error específico
              } else {
                console.log('Respuesta de loginEM:', response);
                localStorage.setItem('oauth', 'true');
                observer.next(result);
                observer.complete();
              }
            }, error => {
              console.error('Error al realizar el loginEM:', error);
              observer.error('Error al realizar el loginEM: ' + error.message); // Mensaje de error específico
            });
          } else {
            console.error('Usuario o correo electrónico no disponibles.');
          }
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

registerUser2(data: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ApiKey': '_$4DM1N$_',
  });

  return this.http.post(`${this.apiUrl}/usuarios/registro3`, data, { headers }).pipe(
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

  solicitarContacto(meet: string, usuario: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': '_$4DM1N$_',
    });

    const body = {
      meet,
      usuario
    };

    return this.http.post(`${this.apiUrl}/meet/solicitud`, body, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al solicitar contacto:', error);
        return throwError(error);
      })
    );
  }

  confirmarContacto(usuario: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': '_$4DM1N$_',
    });

    const body = {
      solicitud: usuario
    };

    return this.http.put(`${this.apiUrl}/meet/confirmacion`, body, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al solicitar contacto:', error);
        return throwError(error);
      })
    );
  }

  cancelAssistance(data: { solicitud: string; motivo: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': '_$4DM1N$_', 
    });

    return this.http.put(`${this.apiUrl}/meet/cancelacion`, data, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al cancelar la asistencia:', error);
        return throwError(error);
      })
    );
  }


  getEventDetails(uuid: string): Observable<any> {
    const headers = new HttpHeaders({
      'ApiKey': '_$4DM1N$_' 
    });
    return this.http.get(`${this.apiUrl}/meet/listings?uid=${uuid}`, { headers });
  }

  uploadAvatar(uid: string, avatarBase64: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': '_$4DM1N$_',
    });

    const body = {
      uid: uid,
      avatar_base64: avatarBase64
    };

    return this.http.patch(`${this.apiUrl}/usuarios/avatar_base64`, body, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al subir el avatar:', error);
        return throwError(error);
      })
    );
  }

  crearMeeting(meetingData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': '_$4DM1N$_',
    });

    return this.http.post(`${this.apiUrl}/meet/registro`, meetingData, { headers });
  }

  uploadImage(uid: string, imageBase64: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': '_$4DM1N$_',
    });

    const body = {
      uid: uid,
      portada_base64: imageBase64
    };

    return this.http.patch(`${this.apiUrl}/meet/portada_base64`, body, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al subir la imagen:', error);
        return throwError(() => new Error('Error al subir la imagen'));
      })
    );
  }
  

  uploadImageFirebase(file: File) {
    const filePath = `images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    let urlImage = '';
    return task.snapshotChanges().pipe(
      finalize(() => {
        // Obtener el enlace de descarga pública
        fileRef.getDownloadURL().toPromise().then(url => {
          console.log("Enlace de descarga:", url); // Agregado para mostrar el enlace en consola
          urlImage = url;
        });
        return urlImage;
       // return fileRef.getDownloadURL().toPromise(); // Cambiado para devolver una promesa
      })
    );
  }
}


