import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockUsersPage } from './block-users.page';

describe('BlockUsersPage', () => {
  let component: BlockUsersPage;
  let fixture: ComponentFixture<BlockUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
