import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditSubCategoryComponent } from './modal-edit-sub-category.component';

describe('ModalEditSubCategoryComponent', () => {
  let component: ModalEditSubCategoryComponent;
  let fixture: ComponentFixture<ModalEditSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
