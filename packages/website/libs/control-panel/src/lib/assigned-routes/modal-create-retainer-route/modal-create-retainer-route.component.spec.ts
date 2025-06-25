import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateRetainerRouteComponent } from './modal-create-retainer-route.component';

describe('ModalCreateRetainerRouteComponent', () => {
  let component: ModalCreateRetainerRouteComponent;
  let fixture: ComponentFixture<ModalCreateRetainerRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateRetainerRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateRetainerRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
