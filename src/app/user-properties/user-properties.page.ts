import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { Storage } from '@ionic/storage-angular';
import { CompressImageService } from '../services/compress-image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServicesService } from '../services/services.service';
import { UserService } from '../services/user.service'; // Importa el servicio

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.page.html',
  styleUrls: ['./user-properties.page.scss'],
})
export class UserPropertiesPage implements OnInit {
  userData: any;
  constructor(private router: Router, private translationService: TranslationService, private storage: Storage, private compressImageService: CompressImageService, private sanitizer: DomSanitizer, private servicesService: ServicesService, private userService: UserService) { }
  selectedLanguage: string = 'es';
  ngOnInit() {
 
    const userData = localStorage.getItem('EMUser');
    if (userData) {
      this.userData = JSON.parse(userData);
    } else {
      this.router.navigate(['/tabs/tab3']);
    }
    this.loadLanguage();
    console.log('URI de foto:', this.userData.payload.uri_foto); // Verificar el valor de uri_foto
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
  async loadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
        console.log('Archivo seleccionado:', file); // Verificar el archivo seleccionado
        const compressedImage = await this.compressImageService.compress(file, 250, 250);
        console.log('Imagen comprimida:', compressedImage); // Verificar la imagen comprimida

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result as string; 
            this.userData.photoURL = base64data; // Asegúrate de que la URL base64 se asigne correctamente
            
            const upload_response = await this.servicesService.uploadAvatar(this.userData.payload.uid, compressedImage).toPromise(); 
            console.log('Respuesta de carga:', upload_response); // Verificar la respuesta de carga

            if (upload_response.payload.uri_foto) {
                // Actualizar solo uri_foto en userData
                this.userData.payload.uri_foto = upload_response.payload.uri_foto;

                // Actualizar el objeto en localStorage
                const storedUser = localStorage.getItem('EMUser');
                if (storedUser) {
                    const EMUser = JSON.parse(storedUser);
                    // Verificar que EMUser tenga la propiedad payload
                    if (EMUser.payload) {
                        // Actualizar todos los datos del usuario, incluyendo uri_foto
                        EMUser.payload = {
                            ...EMUser.payload, // Mantener los datos existentes
                            uri_foto: this.userData.payload.uri_foto, // Actualiza solo uri_foto
                            nombre: this.userData.payload.nombre, // Asegúrate de que el nombre se mantenga
                            alias: this.userData.payload.alias, // Asegúrate de que el alias se mantenga
                            telefono: this.userData.payload.telefono // Asegúrate de que el teléfono se mantenga
                        };
                    } else {
                        console.error('EMUser no tiene la propiedad payload');
                    }
                    localStorage.setItem('EMUser', JSON.stringify(EMUser)); // Guarda el objeto completo sin perder otros datos
                    console.log('EMUser actualizado en localStorage:', EMUser); // Verificar el objeto actualizado
                } else {
                    console.error('No se encontró EMUser en localStorage');
                }
                
                // Actualizar datos del usuario en el servicio
                this.userService.updateUserData({ 
                    payload: { 
                        uri_foto: this.userData.payload.uri_foto,
                        nombre: this.userData.payload.nombre,
                        uid: this.userData.payload.uid,
                        alias: this.userData.payload.alias,
                        telefono: this.userData.payload.telefono
                    } 
                });
            } else {
                console.warn('No se recibió uri_foto en la respuesta de carga');
            }
        };

        const blob = new Blob([compressedImage], { type: file.type });
        reader.readAsDataURL(blob);
    } else {
        console.warn('No se seleccionó ningún archivo');
    }
  }
}
