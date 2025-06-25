import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryGeneralFormComponent } from './category-general-form.component';

describe('CategoryGeneralFormComponent', () => {
  let component: CategoryGeneralFormComponent;
  let fixture: ComponentFixture<CategoryGeneralFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryGeneralFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryGeneralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
