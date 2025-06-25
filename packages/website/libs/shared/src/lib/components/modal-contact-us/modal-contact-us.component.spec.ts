import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContactUsComponent } from './modal-contact-us.component';

describe('ModalContactUsComponent', () => {
  let component: ModalContactUsComponent;
  let fixture: ComponentFixture<ModalContactUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
