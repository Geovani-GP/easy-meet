import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  userData: any;
  myAssists: any[] = [];
  myMeetings: any[] = []; 

  constructor(private router: Router, private servicesService: ServicesService, private translationService: TranslationService) { }

  ngOnInit() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userData = JSON.parse(userData);
      this.loadMyAssists();
      this.loadMyMeetings(); 
    } else {
      this.router.navigate(['/tabs/tab3']);
    }
  }

  loadMyAssists() {
    const uid = localStorage.getItem('uid');
    if (uid) {
      this.servicesService.getMyAssists(uid, 1).subscribe(
        (response) => {
          this.myAssists = response.payload || []; // Asegúrate de que sea un array
        },
        (error) => {
          console.error('Error al cargar mis asistencias:', error);
          this.myAssists = []; // Asegúrate de que no se mantenga un estado anterior
        }
      );
    }
  }

  loadMyMeetings() {
    const uid = localStorage.getItem('uid');
    if (uid) {
      this.servicesService.getMyMeetings(uid, 1).subscribe(
        (response) => {
          this.myMeetings = response.payload || []; // Asegúrate de que sea un array
        },
        (error) => {
          console.error('Error al cargar mis reuniones:', error);
          this.myMeetings = []; // Asegúrate de que no se mantenga un estado anterior
        }
      );
    }
  }

  navigateToCreateMeeting() {
    this.router.navigate(['/create-meeting']);
  }

  navigateToMeetingDetail(meeting: any) {
    this.router.navigate(['/reuniones-detalle'], { state: { meeting } });
  }
  
  navigateToAssistanceDetail(assistance: any) {
    this.router.navigate(['/asistencias-detalle'], { state: { assistance } });
  }

  navigateToCreateInterests() {
    this.router.navigate(['/crear-intereses']);
  }

  navigateToUserProperties() {
    this.router.navigate(['/user-properties']); // Asegúrate de que la ruta sea correcta
  }



  logout() {
    localStorage.removeItem('oauth');
    localStorage.removeItem('uid');
    localStorage.removeItem('userData');
    this.router.navigate(['/tabs/tab3']);
  }

  payment() {
    this.router.navigate(['/payment']);
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

}
