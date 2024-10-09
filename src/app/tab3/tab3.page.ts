import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { ToastController } from '@ionic/angular';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class Tab3Page implements OnInit {
  email: string = ''; 
  password: string = ''; 

  constructor(private router: Router, private spinnerService: SpinnerService, private servicesService: ServicesService, private toastController: ToastController) {}

  navigateToTab4(event: Event) {
    event.preventDefault(); 
    this.spinnerService.show(); 
    
    setTimeout(() => {
      this.router.navigate(['/tabs/tab4']); 
      this.spinnerService.hide(); 
    }, 3000);
  }

  loadData() {
    this.spinnerService.show(); 
    
    setTimeout(() => {
      this.spinnerService.hide(); 
    }, 3000);
  }

  ngOnInit() {
     
  }

  loadTrends() {
    this.spinnerService.show(); 
    
    setTimeout(() => {
      this.spinnerService.hide(); 
    }, 3000);
  }

  async login() {
    this.spinnerService.show();
    try {
      const user = await this.servicesService.loginWithEmail(this.email, this.password).toPromise();
      console.log('Inicio de sesión exitoso', user);
      
      // Asegúrate de que el valor de 'oauth' se actualice correctamente
      const oauthValue = localStorage.getItem('oauth');
      if (oauthValue === 'true') {
        this.router.navigate(['/tabs/tab4']);
      } else {
        this.showToast('Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
      this.showToast('Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
    } finally {
      this.spinnerService.hide();
    }
  }
  

  async loginWithGoogle() {
    this.spinnerService.show();
   await this.servicesService.loginWithGoogle().subscribe(
        response => {
            console.log('Inicio de sesión con Google exitoso', response);
          if(localStorage.getItem('oauth') === 'true'){
            this.router.navigate(['/tabs/tab4']);
          }else{
            this.showToast('Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
          }
            this.spinnerService.hide();
        },
        error => {
            console.error('Error en el inicio de sesión con Google', error);
            this.spinnerService.hide();
        }
    );
  }

/*   private async sendDeviceToken(): Promise<void> {
    const uid =  localStorage.getItem('uid'); // Obtener el UID del almacenamiento local
    const token =  localStorage.getItem('deviceToken'); // Aquí deberías obtener el token del dispositivo de alguna manera
    console.log(uid, token);
    if (uid && token) {
      console.log(uid, token);
      this.servicesService.sendDeviceToken(uid, token).subscribe(
        response => {
          console.log('Token enviado correctamente:', response);
        },
        error => {
          console.error('Error al enviar el token:', error);
        }
      );
    } else {
      console.error('No se encontró UID en el almacenamiento local o el token es nulo');
    }
  } */

  recoverPassword() {
    if (this.email) {
        this.spinnerService.show();
        this.servicesService.recoverPassword(this.email).subscribe(
            response => {
                console.log(response);
                    this.showToast(response, 'success'); // Muestra un mensaje al usuario
                this.spinnerService.hide();
            },
            error => {
                console.error('Error en la recuperación de contraseña', error);
                this.showToast(error, 'danger'); // Muestra un mensaje de error al usuario
                this.spinnerService.hide();
            }
        );
    } else {
        this.showToast('Por favor, ingresa tu correo electrónico.', 'warning');
    }
  }

  showToast(message: string, type: 'success' | 'warning' | 'danger') {
    let color: string;

    switch (type) {
      case 'success':
        color = 'success'; // Cambiar a 'success' para el color
        break;
      case 'warning':
        color = 'warning'; // Cambiar a 'warning' para el color
        break;
      case 'danger':
        color = 'danger'; // Cambiar a 'danger' para el color
        break;
      default:
        color = 'dark'; // Color por defecto
    }

    this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color // Se agrega el color
    }).then(toast => toast.present());
  }
}
