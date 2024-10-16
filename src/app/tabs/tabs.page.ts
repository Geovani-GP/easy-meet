import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { TranslationService } from '../services/translation.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(private router: Router, private authService: AuthServiceService, private translationService: TranslationService) {}

  async navigateTo(tab: string) {
    if (tab === 'tab3' && !this.authService.isAuthenticated()) {
      // Si el usuario intenta acceder a tab3 y no está autenticado, redirigir a login
      await this.router.navigate(['/tabs/tab3']);
    } else if (tab === 'tab4' && !this.authService.isAuthenticated()) {
      // Si el usuario intenta acceder a tab4 y no está autenticado, redirigir a login
      await this.router.navigate(['/tabs/tab3']);
    } else {
      // Redirigir a la pestaña correspondiente
      await this.router.navigate([`/tabs/${tab}`]);
    }
  }
  
  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }
}
