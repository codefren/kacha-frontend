import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGeneratorRouteComponent } from './modal-generator-route.component';

describe('ModalGeneratorRouteComponent', () => {
  let component: ModalGeneratorRouteComponent;
  let fixture: ComponentFixture<ModalGeneratorRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGeneratorRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGeneratorRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
