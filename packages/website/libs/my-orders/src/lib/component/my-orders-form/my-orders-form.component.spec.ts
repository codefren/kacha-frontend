import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrdersFormComponent } from './my-orders-form.component';

describe('MyOrdersFormComponent', () => {
  let component: MyOrdersFormComponent;
  let fixture: ComponentFixture<MyOrdersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrdersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrdersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
