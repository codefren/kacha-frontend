import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrdersModalSearchProductsComponent } from './my-orders-modal-search-products.component';

describe('MyOrdersModalSearchProductsComponent', () => {
  let component: MyOrdersModalSearchProductsComponent;
  let fixture: ComponentFixture<MyOrdersModalSearchProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrdersModalSearchProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrdersModalSearchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
