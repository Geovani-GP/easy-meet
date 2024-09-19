import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearInteresesPage } from './crear-intereses.page';

describe('CrearInteresesPage', () => {
  let component: CrearInteresesPage;
  let fixture: ComponentFixture<CrearInteresesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearInteresesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
