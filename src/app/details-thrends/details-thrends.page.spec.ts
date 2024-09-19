import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsThrendsPage } from './details-thrends.page';

describe('DetailsThrendsPage', () => {
  let component: DetailsThrendsPage;
  let fixture: ComponentFixture<DetailsThrendsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsThrendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
