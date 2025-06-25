import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrdersModalSearchClientComponent } from './my-orders-modal-search-client.component';

describe('MyOrdersModalSearchClientComponent', () => {
  let component: MyOrdersModalSearchClientComponent;
  let fixture: ComponentFixture<MyOrdersModalSearchClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrdersModalSearchClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrdersModalSearchClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
