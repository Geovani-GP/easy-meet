import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.page.html',
  styleUrls: ['./user-properties.page.scss'],
})
export class UserPropertiesPage implements OnInit {
  userData: any;
  constructor(private router: Router, private translationService: TranslationService, private storage: Storage) { }
  selectedLanguage: string = 'es';
  ngOnInit() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userData = JSON.parse(userData);
    } else {
      this.router.navigate(['/tabs/tab3']);
    }
    this.loadLanguage();
  }

  async onLanguageChange(event: any) {
    this.selectedLanguage = event.detail.value;
    await this.storage.set('selectedLanguage', this.selectedLanguage);
    this.translationService.setLanguage(this.selectedLanguage);
    console.log('Idioma seleccionado:', this.selectedLanguage);
  }

  loadLanguage() {
   
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
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
