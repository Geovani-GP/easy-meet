import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPropertiesPage } from './user-properties.page';

describe('UserPropertiesPage', () => {
  let component: UserPropertiesPage;
  let fixture: ComponentFixture<UserPropertiesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
