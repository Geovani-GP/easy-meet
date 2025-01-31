import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { TranslationService } from '../services/translation.service';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-block-users',
  templateUrl: './block-users.page.html',
  styleUrls: ['./block-users.page.scss'],
})
export class BlockUsersPage implements OnInit {
  isModalOpen: boolean = false;
  blockedUsers: any[] = [];
  selectedUser: any;
  userUid: string | null = null;

  constructor(private apiService: ServicesService, private translationService: TranslationService, private toastController: ToastController) {
    this.loadBlockedUsers();
  }

  ngOnInit() {
    this.loadBlockedUsers();
  }

  loadBlockedUsers() {
    const uid = localStorage.getItem('uid');
    console.log('UID obtenido:', uid); 
    if (uid) {
      this.apiService.blockList(uid).subscribe(
        (users: any[]) => {
          this.blockedUsers = Array.isArray(users) ? users : [];
          console.log('Usuarios bloqueados:', this.blockedUsers);
        },
        error => {
          console.error('Error al cargar usuarios bloqueados', error);
          this.blockedUsers = [];
        }
      );
    }
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }
  
  openModal(user: any) {
    this.selectedUser = user; 
    this.isModalOpen = true;
  }

  resetModal() {
    this.selectedUser = null; 
    this.isModalOpen = false; 
  }

  unblockUser(uid: string) {
    console.log(uid);
    const userUid = localStorage.getItem('uid');
    if (userUid) {
      this.apiService.UnlockUsers(userUid, uid).subscribe(
        async response => {
          console.log('Usuario desbloqueado:', response);
          const toast = await this.toastController.create({
            message: this.translate('usuario_desbloqueado'),
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.loadBlockedUsers();
          this.resetModal();
        },
        error => {
          console.error('Error al desbloquear usuario', error);
        }
      );
    }
  }

  

}
