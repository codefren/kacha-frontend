import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersConfirmDialogComponent } from './users-confirm-dialog.component';

describe('UsersConfirmDialogComponent', () => {
  let component: UsersConfirmDialogComponent;
  let fixture: ComponentFixture<UsersConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
