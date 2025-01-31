import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';
import { ServicesService } from '../services/services.service';
import { ToastController } from '@ionic/angular';
import { TranslationService } from '../services/translation.service';
import { Share } from '@capacitor/share';
import { ModalController } from '@ionic/angular';
import { EmailModalComponent } from '../components/email-modal/email-modal.component';
import { IonActionSheet } from '@ionic/angular';
import { ActionSheetController, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-thrends',
  templateUrl: './details-thrends.page.html',
  styleUrls: ['./details-thrends.page.scss'],
})
export class DetailsThrendsPage implements OnInit {
  id: number = 0;
  trendDetails: any;
  oauth: string | undefined;
  trend: any;
  isLoading: boolean = true;
  usuario:any;
  reportTypes: any[] = [];
  @ViewChild('blockUserModal', { static: true }) blockUserModal!: IonModal;
  @ViewChild('reportPostModal', { static: true }) reportPostModal!: IonModal;
  reportReason: string = '';
  reportDescription: string = '';
  selectedReportTypeId: string = '';

  constructor(private route: ActivatedRoute,
    private apiService: ServicesService,
    private spinnerService: SpinnerService,
    private toastController: ToastController,
    private translationService: TranslationService,
    private modalController: ModalController,
    private router: Router) {
    
    this.trend = JSON.parse(localStorage.getItem('selectedTrend') || '{}');
  }
  ngOnInit() {
    this.oauth = localStorage.getItem('oauth') || '';
    this.loadTrendDetails(); 
  }

  public actionSheetButtons=[
    {
      text:this.translate('reportar-publicacion'),
      role:'destructive',
      data:{
        action:'report'
      },
      handler: ()=>{
        this.openReportPostModal();
      }
    },
    {
      text:this.translate('bloquear-usuario'),
      role:'destructive',
      data:{
        action: 'block',
      },
      handler: () => {
        this.openBlockUserModal(); 
      },
    },
    {
      text:'Cancel',
      role:'cancel',
      data:{
        action:'cancel'
      },
    }
  ]

  loadTrendDetails() {
    this.spinnerService.show();
    const trendId = this.route.snapshot.paramMap.get('id'); 
    if (trendId) {
      this.apiService.getTrendDetails(trendId).subscribe( 
        (response) => {
          this.trendDetails = response.payload; 
          console.log('Detalles del trend:', this.trendDetails); 
          this.isLoading = false; 
          this.spinnerService.hide(); 
      },
      (error) => {
        console.error('Error al obtener detalles del trend:', error); 
        this.isLoading = false; 
        this.spinnerService.hide(); 
      }
    );
  }else
    if (this.trend) {
      console.log('Trend:', this.trend);
      console.log(this.trend)
      this.apiService.getTrendDetails(this.trend.uid).subscribe(
        (response) => {
          this.trendDetails = response.payload; 
          console.log('Detalles del trend:', this.trendDetails); 
          this.isLoading = false; 
          this.spinnerService.hide(); 
      },
      (error) => {
        console.error('Error al obtener detalles del trend:', error); 
        this.isLoading = false; 
        this.spinnerService.hide(); 
      }
    );
  }
}



shareTrend() {
  const message = this.trendDetails.descripcion; 
  const title = this.trend.titulo; 
  const url = 'URL_DE_TU_TENDENCIA'; 

  Share.share({
      title: title,
      text: message,
      url: url,
  }).then(() => console.log('Compartido con éxito'))
    .catch((error) => console.error('Error al compartir:', error));
}

translate(key: string): string {
  if (this.translationService && this.translationService.translate) {
    return this.translationService.translate(key);
  }
  console.warn('Translation service is not available');
  return key;
}

async contactar() {
  this.usuario = await JSON.parse(localStorage.getItem('EMUser') || '{}');
  const uid = this.usuario.payload.uid;
  this.apiService.verificaEmail(uid).subscribe(
    async (verificacion) => {
      console.log('verificacion de correo por servicio', verificacion);


      const emailVerificado = verificacion.payload.email;
      console.log('Email verificado:', emailVerificado);
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (emailPattern.test(emailVerificado)) {
        const storedUid = localStorage.getItem('uid') || '';
         if (this.oauth && storedUid) { 
            this.apiService.solicitarContacto(this.trend.uid, storedUid).subscribe(
              async (response) => {
                console.log('Solicitud de contacto enviada:', response);
                const toast = await this.toastController.create({
                  message: 'Solicitud de contacto enviada con éxito.',
                  duration: 2000,
                  color: 'success' 
                });
                await toast.present();
              },
              async (error) => {
                console.error(error);
                const toast = await this.toastController.create({
                  message: 'La solicitud ya fue registrada.',
                  duration: 2000,
                  color: 'danger' 
                });
                await toast.present();
              }
            );
          } else {
            console.warn('Usuario no autenticado. No se puede enviar la solicitud de contacto.');
            const toast = await this.toastController.create({
              message: 'Usuario no autenticado. No se puede enviar la solicitud de contacto.',
              duration: 2000,
              color: 'warning' 
            });
            await toast.present();
          } 
      }else{
        this.openEmailModal(this.usuario.payload.uid);
      }
      
    },
    async (error) => {
      this.openEmailModal(this.usuario.payload.uid);
      console.error('Error al verificar el correo:', error);
      const toast = await this.toastController.create({
        message: 'Error al verificar el correo.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  );
}
  

async openEmailModal(uuid: string) {
  const modal = await this.modalController.create({
      component: EmailModalComponent,
      componentProps: { uuid },
      cssClass: 'my-custom-class'
  });
  return await modal.present();
}


async openBlockUserModal() {
  await this.blockUserModal.present();
  console.log('Modal de bloqueo de usuario abierto');
}


closeBlockUserModal() {
  this.blockUserModal.dismiss();
}

  async confirmBlockUser() {
  this.usuario = await JSON.parse(localStorage.getItem('EMUser') || '{}');
  const uid = this.usuario.payload.uid;
  console.log('uid de usuario',uid);
  console.log('uid del usuario a bloquear',this.trendDetails.usuario);
  this.apiService.blockUsers(uid, this.trendDetails.usuario).subscribe(
    async (response) => {
      const toast = await this.toastController.create({
        message: 'Usuario bloqueado con éxito.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.closeBlockUserModal();
      this.spinnerService.hide();
      this.router.navigate(['/tabs/tab2']);
    },
    async (error) => {
      const toast = await this.toastController.create({
        message: 'El usuario ya estaba bloqueado.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      this.closeBlockUserModal()
      this.spinnerService.hide();
    }
  );
}


async openReportPostModal() {
  this.loadReportType();
  await this.reportPostModal.present();
  this.loadReportType();
  console.log('Modal de reportar publicación abierto');
  this.loadReportType();
}

closeReportPostModal() {
  this.reportPostModal.dismiss();
}

async submitReport() {
    this.usuario = await JSON.parse(localStorage.getItem('EMUser') || '{}');
    const uid = this.usuario.payload.uid;

    if (!uid) {
      this.spinnerService.hide();
      const toast = await this.toastController.create({
        message: 'Usuario no autenticado. No se puede enviar el reporte.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return; 
    }

    if (this.reportTypes.length === 0 || !this.selectedReportTypeId) {
      this.spinnerService.hide();
      const toast = await this.toastController.create({
        message: 'Por favor, seleccione un tipo de reporte.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return; 
    }

    this.spinnerService.show();
    this.apiService.sendReport(this.trend.uid, uid, this.selectedReportTypeId, this.reportDescription).subscribe(
      async (response) => {
        const toast = await this.toastController.create({
          message: 'Su reporte se mando correctamente.',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.closeReportPostModal();
        this.spinnerService.hide();
        return;
      },
      async (error) => {
        this.spinnerService.hide();
        if (error.status === 409) {
          const toast = await this.toastController.create({
            message: 'Reclamación ya existe.',
            duration: 2000,
            color: 'warning'
          });
          await toast.present();
        } else {
          const toast = await this.toastController.create({
            message: 'Error al enviar el reporte.',
            duration: 2000,
            color: 'warning'
          });
          await toast.present();
        }
      }
    );
}

loadReportType() {
  this.spinnerService.show();  
  this.apiService.reportType().subscribe(
    (response) => {
      this.spinnerService.hide(); 
      if (response.payload && Array.isArray(response.payload)) {
        this.reportTypes = response.payload.map((types: any) => ({
          id: types.id,
          name: this.translate(types.descripcion)
        }));
      } else {
        console.error('La respuesta no contiene payloads o no es un arreglo:', response);
      }
    },
    (error) => {
      this.spinnerService.hide(); 
      console.error('Error al cargar intereses:', error);
    }
  );
}

onReportTypeChange(selectedId: string) {
    this.selectedReportTypeId = selectedId;
}

}
