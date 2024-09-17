import { Component, EventEmitter, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  styles: [],
  encapsulation: ViewEncapsulation.None
})

export class SplashScreenComponent implements OnInit {

  ngAfterViewInit() {
    const items = document.querySelectorAll('.item-native');
    items.forEach(item => {
        item.classList.remove('item-native'); // Elimina la clase
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
    'Conecta con gente',
    'Crea y planifica reuniones',
    'Expande tus reaciones'
  ];

  imageDescriptions: string[] = [
    'Encuentra tu grupo y organiza reuniones llenas de pasión y diversión',
    'EasyMeet es una aplicación diseñada para simplificar la gestion de encuentros y reuniones.',
    'Promueve realciones más sólidas al fomentar la escucha activa y el entendimiento mutuo.'
  ];

  fadeOut: boolean = false;
  @Output() splashDismissed = new EventEmitter<void>();

  constructor(private storage: Storage, private navCtrl: NavController) { }

  async ngOnInit() {
    await this.storage.create();
    this.skipSplash = await this.storage.get('skipSplash') || false;
    console.log('skipSplash:', this.skipSplash);
    if (this.skipSplash) {
      this.dismissSplash();
    }
    this.startAutoSlide();
  }

  async continue() {
    if (this.skipSplash) {
      await this.storage.set('skipSplash', true);
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
}
