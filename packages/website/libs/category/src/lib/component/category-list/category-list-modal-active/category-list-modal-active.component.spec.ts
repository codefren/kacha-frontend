import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListModalActiveComponent } from './category-list-modal-active.component';

describe('CategoryListModalActiveComponent', () => {
  let component: CategoryListModalActiveComponent;
  let fixture: ComponentFixture<CategoryListModalActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryListModalActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListModalActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
