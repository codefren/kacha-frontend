import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrdersModalConfirmationComponent } from './my-orders-modal-confirmation.component';

describe('MyOrdersModalConfirmationComponent', () => {
  let component: MyOrdersModalConfirmationComponent;
  let fixture: ComponentFixture<MyOrdersModalConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrdersModalConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrdersModalConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
