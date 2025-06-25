import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsModalProductPriceConfirmComponent } from './products-modal-product-price-confirm.component';

describe('ProductsModalProductPriceConfirmComponent', () => {
  let component: ProductsModalProductPriceConfirmComponent;
  let fixture: ComponentFixture<ProductsModalProductPriceConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsModalProductPriceConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsModalProductPriceConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
