import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { TranslationService } from '../services/translation.service';
import { AlertController, NavController } from '@ionic/angular';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  
  trends: any[] = []; 
  currentPage: number = 1; 
  hasMoreData: boolean = true; 
  isAgreed = false;  // Estado del checkbox
  isPrivacyModalOpen: boolean = false;

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private apiService: ServicesService,
    private translationService: TranslationService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/tabs/tab2') {
          console.log('El usuario volvió al tab 2... recargar meets');
          this.loadTrends(); 
          // Aquí puedes ejecutar una acción
        }
      }
    });
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter.....");
    
    await this.loadTrends(); 
  }

  async refreshData(event: any) {
    this.currentPage = 1; 
    await this.loadTrends(); 
    event.target.complete(); 
  }
  async ngOnInit() { 
    this.loadTrends(); 
    this.checkDevice();
    
    this.verificacionDeAceptacionTyC();
    //this.presentAlert24hrs();

  }

  verificacionDeAceptacionTyC(){
    let tyc = null;
    tyc = localStorage.getItem("tyc");
    if(!tyc){
      console.log("debe de aceptar terminos y condiciones");
      this.presentAlertTyC();
    }else{
      console.log("tyc", tyc);
      console.log("ya acepto terminos y condiciones");
      
    }
    //console.log("tyc", tyc);
    
  }
  async presentAlertTyC() {
    const alert = await this.alertController.create({
      header: this.translate("alertTyCT"),
      message: this.translate("alerTyCM"),
      buttons: [{
        text: this.translate("alertbtnTxt"),
        handler: () => {
          console.log('El usuario aceptó.');
          this.isPrivacyModalOpen = true;
        }
      }],
      backdropDismiss: false  
    });

    await alert.present();
  }

  

  acceptPrivacyPolicy() {
    console.log("usuario acepto terminos y condiciones");
    
    localStorage.setItem("tyc", "1");
    this.isPrivacyModalOpen = false;
  }

  toggleAcceptButton() {
    // No es necesario hacer nada aquí, Angular detecta automáticamente el cambio en el template.
  }


  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  loadTrends() {
    this.spinnerService.show(); 
    this.apiService.getTrends(this.currentPage).subscribe(
      (response) => {
        this.trends = response.payload; 
        this.hasMoreData = this.trends.length > 0; 
        this.spinnerService.hide(); 
      },
      (error) => {
        console.error('Error al obtener tendencias en Tab2:', error); 
        this.spinnerService.hide(); 
      }
    );
  }

  loadMoreData(event: any) {
    this.currentPage++; 
    this.spinnerService.show(); 
    this.apiService.getTrends(this.currentPage).subscribe(
      (response) => {
        const newTrends = response.payload; 
        this.trends = [...this.trends, ...newTrends]; 
        this.hasMoreData = newTrends.length > 0; 
        event.target.complete(); 
        if (newTrends.length === 0) {
          event.target.disabled = true; 
        }
        this.spinnerService.hide(); 
      },
      (error) => {
        console.error('Error al cargar más tendencias:', error);
        event.target.complete(); 
        this.spinnerService.hide(); 
      }
    );
  }

  navigateToDetails(trend: any) {
    if (!trend) {
      console.warn('Trend no está definido'); // Manejo de caso undefined
      return; // Salir de la función si trend es undefined
    }
    console.log('Trend:', trend);
    localStorage.setItem('selectedTrend', JSON.stringify(trend)); 
    const shareLink = `https://localhost:8100/details-thrends;id=${trend.uid}`; // Asegúrate de que 'id' sea la propiedad correcta
    console.log('Enlace para compartir:', shareLink); // Muestra el enlace en la consola
    this.router.navigate(['/details-thrends', { id: trend.uid }]); // Pasar el ID como parámetro
  }

  async checkDevice() {
    const info = await Device.getInfo();
    console.log('Device Info:', info);

    if (info.model.includes('iPad')) {
      console.log('¡Este dispositivo es un iPad!... regresando al splash');
    //  this.router.navigate(['/splash']);
    //  this.navCtrl.navigateRoot('/splash-screen');
 
    }


   // CreatedOnToolsVersion = 9.2;
  }
}
