import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { TranslationService } from '../services/translation.service';
import { AlertController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { 
  AppTrackingTransparency, 
  AppTrackingStatusResponse 
} from 'capacitor-plugin-app-tracking-transparency';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SplashScreenComponent implements OnInit {

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  isPrivacyModalOpen: boolean = false;
  isAgreed = false;  // Estado del checkbox
  async ngAfterViewInit() {
    const items = document.querySelectorAll('.item-native');
    items.forEach(item => {
        item.classList.remove('item-native'); 
    });
  }

  private touchStartX: number = 0;
  skipSplash: boolean = false;
  currentIndex: number = 0;
  images: string[] = [
    '/assets/info_1.png',
    '/assets/info_2.png',
    '/assets/info_3.png'
  ];

  imageDescriptionsTitle: string[] = [
    this.translate('image-title1'),
    this.translate('image-title2'),
    this.translate('image-title3')
  ];

  imageDescriptions: string[] = [
    this.translate('image-text1'),
    this.translate('image-text2'),
    this.translate('image-text3')
  ];
  isDesktop: boolean = false;
  fadeOut: boolean = false;
  @Output() splashDismissed = new EventEmitter<void>();
  selectedLanguage: string = 'en';
  isLanguageSelected: boolean = false;

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private translationService: TranslationService,
    private alertController: AlertController
  ) {
    this.translationService.setLanguage('en').then(() => {
      this.updateImageDescriptions();
    });


     
  }

  async ngOnInit() {
    try {
      await this.storage.create();
      this.skipSplash = await this.storage.get('skipSplash') || false;
      this.selectedLanguage = await this.storage.get('selectedLanguage') || 'en';
      await this.storage.set('selectedLanguage', this.selectedLanguage);
      this.isLanguageSelected = !!this.selectedLanguage;

      console.log('ingresa el usuario a la app', this.skipSplash);

      if (this.skipSplash) {
        this.dismissSplash();
      }
      this.startAutoSlide();
      this.desktop();
      await this.translationService.setLanguage(this.selectedLanguage);
      await this.updateImageDescriptions(); 
      //this.handleTrackingTransparency();
    } catch (error) {
      console.error('Error al inicializar:', error);
    }
  }


  async presentAlertTyC() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'Debes leer y aceptar los Terminos y Condiciones de Uso para continuar usando EasyMeet',
      buttons: [{
        text: 'Siguiente',
        handler: () => {
          console.log('El usuario aceptó.');
          this.isPrivacyModalOpen = true;
          //this.dismissSplash();
          // Puedes ejecutar alguna acción aquí si es necesario
        }
      }],
      backdropDismiss: false  // Evita que se cierre tocando fuera de la alerta
    });

    await alert.present();
  }

  acceptPrivacyPolicy() {
    this.isPrivacyModalOpen = false;
  }

  async onLanguageChange(event: any) {
    this.selectedLanguage = event.detail.value;
    await this.storage.set('selectedLanguage', this.selectedLanguage);
    this.translationService.setLanguage(this.selectedLanguage);
    console.log('Idioma seleccionado:', this.selectedLanguage);
    this.updateImageDescriptions();
  }

  private async updateImageDescriptions() {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.imageDescriptionsTitle = [
          this.translationService.translate('image-title1'),
          this.translationService.translate('image-title2'),
          this.translationService.translate('image-title3')
        ];

        this.imageDescriptions = [
          this.translationService.translate('image-text1'),
          this.translationService.translate('image-text2'),
          this.translationService.translate('image-text3')
        ];

        console.log('Descripciones de imágenes actualizadas:', this.imageDescriptionsTitle, this.imageDescriptions);
        
        resolve();
      }, 100);
    });
  }

  async desktop(){
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop){
      await this.storage.set('skipSplash', false);
    }
  }

  async continue() {
    //this.presentAlertTyC();
    
    if (this.skipSplash) {
      await this.storage.set('skipSplash', true);
    }
    else{
      await this.storage.set('skipSplash', false);
    }

    this.dismissSplash();
//
  }

  private dismissSplash() {
    this.splashDismissed.emit();
    this.navCtrl.navigateRoot('/tabs');
  }

  nextSlide() {
    this.fadeOut = true;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.fadeOut = false;
    }, 500);
  }

  

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  startAutoSlide() {
    setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchDiff = this.touchStartX - touchEndX;

    if (touchDiff > 50) {
      this.nextSlide();
    } else if (touchDiff < -50) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }

  onImageClick(index: number) {
    this.currentIndex = index;
    this.fadeOut = true;
    setTimeout(() => {
      this.fadeOut = false;
    }, 500);
  }

  async onCheckboxChange(event: any) {
    this.skipSplash = event.detail.checked; 
    await this.storage.set('skipSplash', this.skipSplash); 
    console.log('skipSplash guardado como:', this.skipSplash); 
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  toggleFullScreen() {
    const video = this.videoPlayer.nativeElement as any;
    video.style.display = 'block';
    video.play();

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }

    video.onended = () => {
      this.hideVideo();
    };

    video.onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        this.hideVideo();
      }
    };
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 || event.key === 'Escape' || event.key === 'Esc' || event.charCode === 27) {
      this.hideVideo();
    }
  this.hideVideo();
  }

  hideVideo() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.style.display = 'none';
    video.pause();
    video.currentTime = 0;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    setTimeout(() => {
      video.style.display = 'none';
    }, 100);
  }

  toggleAcceptButton() {
  }

  async handleTrackingTransparency() {
    try {
      const deviceInfo = await Device.getInfo();

      if (deviceInfo.platform === 'ios') {
        console.log('Verificando estado de App Tracking Transparency en iOS');
        const statusResponse: AppTrackingStatusResponse = await this.getTrackingStatus();

        if (statusResponse.status === 'notDetermined') {
          console.log('El usuario aún no ha decidido. Solicitando permiso...');
          await this.requestTrackingPermission();
        } else {

          if(statusResponse.status == "denied"){
            this.presentAlertTR(); 
          }
        }
      } else {
        console.log('Tracking no requiere permisos explícitos en esta plataforma.');
       
      }
    } catch (error) {
      console.error('Error al manejar el estado de tracking transparency:', error);
      
    }
  }

  async getTrackingStatus(): Promise<AppTrackingStatusResponse> {
    const response = await AppTrackingTransparency.getStatus();
    console.log('Estado del permiso de seguimiento:', response);
    return response;
  }

  async requestTrackingPermission(): Promise<AppTrackingStatusResponse> {
    const response = await AppTrackingTransparency.requestPermission();
    console.log('Resultado de la solicitud de permiso de seguimiento:', response);
    return response;
  }

  async presentAlertTR() {
    const alert = await this.alertController.create({
      header: this.translate("aviso"),
      message: this.translate("txtTR"),
      buttons: [{
        text: this.translate("aceptar"),
        handler: () => {
        }
      }],
      backdropDismiss: false  
    });
    await alert.present();
  }
}
