import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsModalActiveComponent } from './products-modal-active.component';

describe('ProductsModalActiveComponent', () => {
  let component: ProductsModalActiveComponent;
  let fixture: ComponentFixture<ProductsModalActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsModalActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsModalActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
