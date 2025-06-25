import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsModalConfirmComponent } from './products-modal-confirm.component';

describe('ProductsModalConfirmComponent', () => {
  let component: ProductsModalConfirmComponent;
  let fixture: ComponentFixture<ProductsModalConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsModalConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsModalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
