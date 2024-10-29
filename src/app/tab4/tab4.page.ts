import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { TranslationService } from '../services/translation.service';
import { ViewWillEnter } from '@ionic/angular';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit, ViewWillEnter {
  userData: any;
  myAssists: any[] = [];
  myMeetings: any[] = []; 

  constructor(private router: Router, private servicesService: ServicesService, private translationService: TranslationService, private userService: UserService) { }

  ngOnInit() {
    console.log('Tab4Page - ngOnInit');
    this.userService.userData$.subscribe(data => {
      console.log('UserData recibido en tab4:', data);
      if (data) {
        this.userData = data;
        this.loadMyAssists();
        this.loadMyMeetings();
      } else {
        console.log('No hay datos de usuario, cargando desde localStorage');
        this.loadUserData();
      }
    });
  }

  ionViewWillEnter() {
    this.loadUserData(); 
  }

  loadUserData() {
    const userData = localStorage.getItem('EMUser');
    console.log('Datos del usuario en localStorage:', userData);
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.userData = parsedData;
      this.userService.updateUserData(parsedData);
      this.loadMyAssists();
      this.loadMyMeetings();
    } else {
      console.warn('No hay datos de usuario en localStorage');
      this.router.navigate(['/tabs/tab3']);
    }
  }

  loadMyAssists() {
    const uid = localStorage.getItem('uid');
    if (uid) {
      this.servicesService.getMyAssists(uid, 1).subscribe(
        (response) => {
         
          this.myAssists = response && response.payload ? response.payload : []; 
        },
        (error) => {
          console.error('Error al cargar mis asistencias:', error);
          this.myAssists = []; 
        }
      );
    }
  }

  loadMyMeetings() {
    const uid = localStorage.getItem('uid');
    if (uid) {
      this.servicesService.getMyMeetings(uid, 1).subscribe(
        (response) => {
          this.myMeetings = response && response.payload ? response.payload : [];
        },
        (error) => {
          console.error('Error al cargar mis reuniones:', error);
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
    localStorage.clear();
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
