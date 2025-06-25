import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBadAddressComponent } from './modal-bad-address.component';

describe('ModalBadAddressComponent', () => {
  let component: ModalBadAddressComponent;
  let fixture: ComponentFixture<ModalBadAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBadAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBadAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
