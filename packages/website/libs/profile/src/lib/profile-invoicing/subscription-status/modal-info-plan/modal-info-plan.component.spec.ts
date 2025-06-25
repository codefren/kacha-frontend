import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoPlanComponent } from './modal-info-plan.component';

describe('ModalInfoPlanComponent', () => {
  let component: ModalInfoPlanComponent;
  let fixture: ComponentFixture<ModalInfoPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
