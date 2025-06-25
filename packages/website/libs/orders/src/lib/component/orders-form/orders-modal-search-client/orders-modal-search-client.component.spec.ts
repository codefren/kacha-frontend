import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersModalSearchClientComponent } from './orders-modal-search-client.component';

describe('OrdersModalSearchClientComponent', () => {
  let component: OrdersModalSearchClientComponent;
  let fixture: ComponentFixture<OrdersModalSearchClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersModalSearchClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersModalSearchClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
