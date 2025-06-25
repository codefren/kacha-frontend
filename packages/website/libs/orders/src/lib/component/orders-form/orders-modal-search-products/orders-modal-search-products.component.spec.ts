import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersModalSearchProductsComponent } from './orders-modal-search-products.component';

describe('OrdersModalSearchProductsComponent', () => {
  let component: OrdersModalSearchProductsComponent;
  let fixture: ComponentFixture<OrdersModalSearchProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersModalSearchProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersModalSearchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
