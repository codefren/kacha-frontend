import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersModalConfirmationComponent } from './orders-modal-confirmation.component';

describe('OrdersModalConfirmationComponent', () => {
  let component: OrdersModalConfirmationComponent;
  let fixture: ComponentFixture<OrdersModalConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersModalConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersModalConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
