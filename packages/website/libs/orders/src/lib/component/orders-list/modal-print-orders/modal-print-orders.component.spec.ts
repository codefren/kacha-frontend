import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrintOrdersComponent } from './modal-print-orders.component';

describe('ModalPrintOrdersComponent', () => {
  let component: ModalPrintOrdersComponent;
  let fixture: ComponentFixture<ModalPrintOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrintOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrintOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
