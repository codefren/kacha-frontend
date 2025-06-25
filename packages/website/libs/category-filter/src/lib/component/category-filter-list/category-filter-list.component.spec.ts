import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFilterListComponent } from './category-filter-list.component';

describe('CategoryFilterListComponent', () => {
  let component: CategoryFilterListComponent;
  let fixture: ComponentFixture<CategoryFilterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryFilterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
