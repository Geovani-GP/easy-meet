import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToCreateMeeting() {
    this.router.navigate(['/create-meeting']);
  }

  navigateToMeetingDetail() {
    this.router.navigate(['/reuniones-detalle']);
  }
  
  navigateToAssistanceDetail() {
    this.router.navigate(['/asistencias-detalle']);
  }

  navigateToCreateInterests() {
    this.router.navigate(['/crear-intereses']);
  }
}
