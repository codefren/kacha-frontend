import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegisterTimeComponent } from './modal-register-time.component';

describe('ModalRegisterTimeComponent', () => {
  let component: ModalRegisterTimeComponent;
  let fixture: ComponentFixture<ModalRegisterTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRegisterTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRegisterTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
