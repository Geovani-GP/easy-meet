import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SplashScreenComponent implements OnInit {

  async ngAfterViewInit() {
    const items = document.querySelectorAll('.item-native');
    items.forEach(item => {
        item.classList.remove('item-native'); // Elimina la clase
    });
   /*  await this.storage.create();
    this.selectedLanguage = await this.storage.get('selectedLanguage') || 'en';
    this.updateImageDescriptions(); */
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
    private translationService: TranslationService
  ) {
    this.translationService.setLanguage('en').then(() => {
      this.updateImageDescriptions();
    });
  }

  async ngOnInit() {
    try {
      await this.storage.create();
      this.skipSplash = await this.storage.get('skipSplash') || false;

      // Verifica si el idioma ya está guardado, si no, establece el inglés como predeterminado
      this.selectedLanguage = await this.storage.get('selectedLanguage') || 'en';
      await this.storage.set('selectedLanguage', this.selectedLanguage);
      this.isLanguageSelected = !!this.selectedLanguage;

      console.log('skipSplash:', this.skipSplash);
      if (this.skipSplash) {
        this.dismissSplash();
      } 
      this.startAutoSlide();
      this.desktop();

      // Asegúrate de que se espera a que se establezca el idioma
      await this.translationService.setLanguage(this.selectedLanguage);
      
      // Espera a que se actualicen las descripciones
      await this.updateImageDescriptions(); 
    } catch (error) {
      console.error('Error al inicializar:', error);
    }
  }

  async onLanguageChange(event: any) {
    this.selectedLanguage = event.detail.value;
    await this.storage.set('selectedLanguage', this.selectedLanguage);
    this.translationService.setLanguage(this.selectedLanguage);
    console.log('Idioma seleccionado:', this.selectedLanguage);
    this.updateImageDescriptions(); // Actualiza las descripciones al cambiar el idioma
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
      }, 100); // Pequeño retraso para asegurar que las traducciones estén listas
    });
  }

  async desktop(){
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop){
      await this.storage.set('skipSplash', false);
    }
  }

  async continue() {
    if (this.skipSplash) {
      await this.storage.set('skipSplash', true);
    }
    else{
      await this.storage.set('skipSplash', false);
    }
    console.log('Continuar pulsado');
    this.dismissSplash();
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
}
