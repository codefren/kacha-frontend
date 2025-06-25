import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryGeneralListComponent } from './category-general-list.component';

describe('CategoryGeneralListComponent', () => {
  let component: CategoryGeneralListComponent;
  let fixture: ComponentFixture<CategoryGeneralListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryGeneralListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryGeneralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
