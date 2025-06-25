import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsModalMeasureComponent } from './products-modal-measure.component';

describe('ProductsModalMeasureComponent', () => {
  let component: ProductsModalMeasureComponent;
  let fixture: ComponentFixture<ProductsModalMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsModalMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsModalMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
