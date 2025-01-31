import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { ToastController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslationService } from '../services/translation.service';
import { UserService } from '../services/user.service';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { App } from '@capacitor/app';
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
  isPrivacyModalOpen: boolean = false;
  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private servicesService: ServicesService,
    private toastController: ToastController,
    public authService: AuthServiceService,
    private translationService: TranslationService,
    private userService: UserService
  ) {
    App.addListener('appUrlOpen', (data: any) => {
      if (data.url && data.url.startsWith('easymeet://callback')) {
        console.log('Redirect URL:', data.url);
      }
    });
  }
  openPrivacyModal() {
    this.isPrivacyModalOpen = true;
  }

  ngOnInit() {
    this.checkAuthAndRedirect();
  }

  ionViewWillEnter() {
    this.checkAuthAndRedirect();
  }

  private async checkAuthAndRedirect() {
    if (this.authService.isAuthenticated()) {
      await this.router.navigate(['/tabs/tab4']);
    } else {
    }
  }

  isIOS(): boolean {
    const userAgent = window.navigator.userAgent;
    const isStandalone = (window.navigator as any).standalone;
    return /iPad|iPhone|iPod/.test(userAgent) && !isStandalone;
  }

  async signInWithApple() {
    try {
      const response = await SignInWithApple.authorize();
      const userApple = response.response.user;

    if (userApple) {
        const loginApple = await this.servicesService.loginApple(userApple).toPromise();
        console.log('login apple1: ',loginApple)
        if (loginApple && loginApple.payload) {
          console.log('login apple2: ',loginApple)
         // await localStorage.setItem('EMUser', JSON.stringify(loginApple));
      //    this.userService.updateUserData(response);
         await localStorage.setItem('oauth', 'true');
         await this.router.navigate(['/tabs/tab4'], { replaceUrl: true });
        } else {
          this.showToast('Error al obtener los datos del usuario', 'danger');
        }
      }
     // };
    } catch (error) {
      console.error('Error en inicio de sesión con Apple:', error);
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

      if (response && response.payload) {
        this.userService.updateUserData(response);
        localStorage.setItem('oauth', 'true');
        await this.router.navigate(['/tabs/tab4'], { replaceUrl: true });
      } else {
        this.showToast('Error al obtener los datos del usuario', 'danger');
      }
    } catch (error) {
      this.showToast('Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
    } finally {
      this.spinnerService.hide();
    }
  }

  async loginWithGoogle() {
    this.spinnerService.show();
    try {
      const response = await this.servicesService.loginWithGoogle().toPromise();
      
      if (response && response.user) {
        localStorage.setItem('oauth', 'true');
        this.checkAuthAndRedirect();
      } else {
        this.spinnerService.hide();
        this.showToast('Error en el inicio de sesión. Datos de usuario incompletos.', 'danger');
      }
    } catch (error) {
      this.showToast('Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
    } finally {
      this.spinnerService.hide();
    }
  }

  recoverPassword() {
    if (this.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.showToast('Por favor, ingresa un correo electrónico válido.', 'warning');
        return;
      }

      this.spinnerService.show();
      this.servicesService.recoverPassword(this.email).subscribe(
        response => {
          this.showToast(response, 'success'); 
          this.spinnerService.hide();
        },
        error => {
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
    return key;
  }
}
