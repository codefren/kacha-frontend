import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDriverDialogComponent } from './change-driver-dialog.component';

describe('ChangeDriverDialogComponent', () => {
  let component: ChangeDriverDialogComponent;
  let fixture: ComponentFixture<ChangeDriverDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDriverDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDriverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
