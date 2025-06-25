import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModalImgInfoComponent } from './product-modal-img-info.component';

describe('ProductModalImgInfoComponent', () => {
  let component: ProductModalImgInfoComponent;
  let fixture: ComponentFixture<ProductModalImgInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductModalImgInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModalImgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
