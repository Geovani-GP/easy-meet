import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { Storage } from '@ionic/storage-angular';
import { CompressImageService } from '../services/compress-image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServicesService } from '../services/services.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.page.html',
  styleUrls: ['./user-properties.page.scss'],
})
export class UserPropertiesPage implements OnInit {
  userData: any;
  selectedLanguage: string = 'es';
  isCropperOpen: boolean = false;
  imageToCrop: string = '';
  cropSize: number = 100; 
  croppedImage: string = '';

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  private isMoving: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;
  private imageX: number = 0;
  private imageY: number = 0;
  zoomLevel: number = 100;
  private originalImage: HTMLImageElement | null = null;
  rotation: number = 0;
  
  constructor(
    private router: Router,
    private translationService: TranslationService,
    private storage: Storage,
    private compressImageService: CompressImageService,
    private sanitizer: DomSanitizer,
    private servicesService: ServicesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('EMUser');
    if (userData) {
      this.userData = JSON.parse(userData);
    } else {
      this.router.navigate(['/tabs/tab3']);
    }
    this.loadLanguage();
  }

  async loadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await this.fileToBase64(file);
        this.imageToCrop = base64;
        this.isCropperOpen = true;
        this.resetCropperState();
        setTimeout(() => {
          this.initializeCropper();
        }, 500);
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private resetCropperState() {
    this.isMoving = false;
    this.imageX = 0;
    this.imageY = 0;
    this.zoomLevel = 100;
    this.originalImage = null;
  }

  private initializeCropper() {
    const canvas = this.canvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      this.originalImage = img;
      canvas.width = 250;
      canvas.height = 250;
      this.drawImage();
    };
    img.src = this.imageToCrop;
  }

  startMoving(event: MouseEvent | TouchEvent) {
    this.isMoving = true;
    if (event instanceof MouseEvent) {
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    } else {
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    }
  }

  moveImage(event: MouseEvent | TouchEvent) {
    if (!this.isMoving) return;

    let currentX: number, currentY: number;
    
    if (event instanceof MouseEvent) {
      currentX = event.clientX;
      currentY = event.clientY;
    } else {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    }

    const deltaX = currentX - this.lastX;
    const deltaY = currentY - this.lastY;

    this.imageX += deltaX;
    this.imageY += deltaY;

    this.lastX = currentX;
    this.lastY = currentY;

    this.drawImage();
  }

  stopMoving() {
    this.isMoving = false;
  }

  updateZoom() {
    this.drawImage();
  }

  public drawImage() {
    const canvas = this.canvas?.nativeElement;
    if (!canvas || !this.originalImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = this.zoomLevel / 100;
    const scaledWidth = this.originalImage.width * scale;
    const scaledHeight = this.originalImage.height * scale;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.drawImage(
      this.originalImage,
      this.imageX - scaledWidth / 2,
      this.imageY - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );
    ctx.restore();
  }

  rotateImage(direction: 'left' | 'right') {
    this.rotation += direction === 'left' ? -90 : 90;
    this.drawImage();
  }

  async cropAndSave() {
    const canvas = this.canvas?.nativeElement;
    if (!canvas) return;

    try {
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 250;
      tempCanvas.height = 250;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      
      tempCtx.drawImage(canvas, 0, 0);

      
      this.croppedImage = tempCanvas.toDataURL('image/jpeg', 0.8);
      this.userData.photoURL = this.croppedImage;

      
      const base64Response = await fetch(this.croppedImage);
      const blob = await base64Response.blob();
      
      const compressedImage = await this.compressImageService.compress(blob as File, 250, 250);
      console.log('Imagen comprimida:', compressedImage);

      
      const upload_response = await this.servicesService.uploadAvatar(
        this.userData.payload.uid, 
        compressedImage
      ).toPromise();

      console.log('Respuesta de carga:', upload_response);

      if (upload_response.payload.uri_foto) {
        
        this.userData.payload.uri_foto = upload_response.payload.uri_foto;

        
        const storedUser = localStorage.getItem('EMUser');
        if (storedUser) {
          const EMUser = JSON.parse(storedUser);
          if (EMUser.payload) {
            EMUser.payload = {
              ...EMUser.payload,
              uri_foto: this.userData.payload.uri_foto,
              nombre: this.userData.payload.nombre,
              alias: this.userData.payload.alias,
              telefono: this.userData.payload.telefono
            };
            localStorage.setItem('EMUser', JSON.stringify(EMUser));
            console.log('EMUser actualizado en localStorage:', EMUser);
          } else {
            console.error('EMUser no tiene la propiedad payload');
          }
        } else {
          console.error('No se encontró EMUser en localStorage');
        }

        
        await this.userService.updateUserData({
          payload: {
            uri_foto: this.userData.payload.uri_foto,
            nombre: this.userData.payload.nombre,
            uid: this.userData.payload.uid,
            alias: this.userData.payload.alias,
            telefono: this.userData.payload.telefono
          }
        });

        
        this.isCropperOpen = false;
      } else {
        console.warn('No se recibió uri_foto en la respuesta de carga');
      }
    } catch (error) {
      console.error('Error al procesar y subir la imagen:', error);
    }
  }

  async onLanguageChange(event: any) {
    
    const savedLanguage = await this.storage.get('selectedLanguage');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
    }
   
    await this.storage.set('selectedLanguage', this.selectedLanguage);
    this.selectedLanguage = event.detail.value;
    this.translationService.setLanguage(this.selectedLanguage);
    console.log('Idioma seleccionado:', this.selectedLanguage);
    
    event.detail.value = this.selectedLanguage;
  }

  async loadLanguage() {
    const savedLanguage = await this.storage.get('selectedLanguage');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
    } else {
      this.selectedLanguage = 'es'; 
    }
  }

  acceptChanges() {
    this.router.navigate(['/tabs/tab4']);
  }


  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }
}
