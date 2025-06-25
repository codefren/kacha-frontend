import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPointPendingComponent } from './modal-point-pending.component';

describe('ModalPointPendingComponent', () => {
  let component: ModalPointPendingComponent;
  let fixture: ComponentFixture<ModalPointPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPointPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPointPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
