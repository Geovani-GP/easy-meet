import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { ToastController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslationService } from '../services/translation.service';
import { UserService } from '../services/user.service';
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
  userData: any;

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private servicesService: ServicesService,
    private toastController: ToastController,
    public authService: AuthServiceService,
    private translationService: TranslationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    console.log('Tab3Page ngOnInit');
    this.checkAuthAndRedirect();
  }

  ionViewWillEnter() {
    console.log('Tab3Page ionViewWillEnter');
    this.checkAuthAndRedirect();
  }

  private async checkAuthAndRedirect() {
    console.log('Verificando autenticación...');
    if (this.authService.isAuthenticated()) {
      console.log('Usuario autenticado en tab3, redirigiendo al área de usuario...');
      await this.router.navigate(['/tabs/tab4']);
      console.log('Redirección a tab4 completada');
    } else {
      console.log('Usuario no autenticado en tab3, permaneciendo en la página');
    }
  }

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

  async login() {
    this.spinnerService.show();
    try {
      if (!this.email || !this.password) {
        this.showToast('Por favor, ingresa tu correo electrónico y contraseña.', 'warning');
        return;
      }

      const response = await this.servicesService.loginWithEmail2(this.email, this.password).toPromise();
      console.log('Respuesta de inicio de sesión:', response);

      if (response && response.payload) {
        // Actualizar los datos del usuario en el servicio
        this.userService.updateUserData(response);
        
        // Guardar el estado de autenticación
        localStorage.setItem('oauth', 'true');
        
        // Navegar al tab4
        await this.router.navigate(['/tabs/tab4'], { replaceUrl: true });
      } else {
        this.showToast('Error al obtener los datos del usuario', 'danger');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      this.showToast('Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
    } finally {
      this.spinnerService.hide();
    }
  }

  async loginWithGoogle() {
    this.spinnerService.show();
    try {
      const response = await this.servicesService.loginWithGoogle().toPromise();
      console.log('Respuesta completa del inicio de sesión con Google:', response);
      
      if (response && response.user) {
        localStorage.setItem('oauth', 'true');
        console.log('Inicio de sesión con Google exitoso');
        this.checkAuthAndRedirect();
      } else {
        this.spinnerService.hide();
        console.error('La respuesta no contiene la información del usuario esperada');
        this.showToast('Error en el inicio de sesión. Datos de usuario incompletos.', 'danger');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión con Google', error);
      this.showToast('Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
    } finally {
      this.spinnerService.hide();
    }
  }

  recoverPassword() {
    if (this.email) {
        this.spinnerService.show();
        this.servicesService.recoverPassword(this.email).subscribe(
            response => {
                console.log(response);
                    this.showToast(response, 'success'); 
                this.spinnerService.hide();
            },
            error => {
                console.error('Error en la recuperación de contraseña', error);
                this.showToast(error, 'danger'); 
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
        color = 'success'; 
        break;
      case 'warning':
        color = 'warning'; 
        break;
      case 'danger':
        color = 'danger'; 
        break;
      default:
        color = 'dark'; 
    }

    this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    }).then(toast => toast.present());
  }

  registerUser() {
    this.router.navigate(['/register-user']);
  }

  navigateToUserArea() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tabs/tab4']);
    } else {
      this.showToast('Por favor, inicia sesión primero.', 'warning');
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }
}
