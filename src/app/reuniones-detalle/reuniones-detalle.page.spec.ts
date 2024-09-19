import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReunionesDetallePage } from './reuniones-detalle.page';

describe('ReunionesDetallePage', () => {
  let component: ReunionesDetallePage;
  let fixture: ComponentFixture<ReunionesDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReunionesDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
