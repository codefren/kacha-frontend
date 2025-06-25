import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrdersListComponent } from './my-orders-list.component';

describe('MyOrdersListComponent', () => {
  let component: MyOrdersListComponent;
  let fixture: ComponentFixture<MyOrdersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrdersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
