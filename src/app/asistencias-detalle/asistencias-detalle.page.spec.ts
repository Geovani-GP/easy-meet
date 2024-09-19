import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsistenciasDetallePage } from './asistencias-detalle.page';

describe('AsistenciasDetallePage', () => {
  let component: AsistenciasDetallePage;
  let fixture: ComponentFixture<AsistenciasDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciasDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
