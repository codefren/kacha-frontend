import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsModalAddCategoryComponent } from './products-modal-add-category.component';

describe('ProductsModalAddCategoryComponent', () => {
  let component: ProductsModalAddCategoryComponent;
  let fixture: ComponentFixture<ProductsModalAddCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsModalAddCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsModalAddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
