import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: { [key: string]: string } = {
    'Proximos-eventos': 'Próximos eventos',
    // Agrega más traducciones aquí
  };
  private currentLanguage: string = 'en';
  private translationsLoaded = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  loadTranslations(language: string): Observable<any> {
    return this.http.get<{ [key: string]: string }>(`assets/i18n/${language}.json`).pipe(
      tap(translations => {
        this.translations = translations;
        this.translationsLoaded.next(true);
      })
    );
  }

  async setLanguage(language: string): Promise<void> {
    this.currentLanguage = language;
    await this.loadTranslations(language).toPromise();
  }

  translate(key: string): string {
    return this.translations[key] || key; // Devuelve la clave si no hay traducción
  }

  waitForTranslationsLoaded(): Promise<boolean> {
    return firstValueFrom(this.translationsLoaded.pipe(
      filter(loaded => loaded)
    ));
  }
}
