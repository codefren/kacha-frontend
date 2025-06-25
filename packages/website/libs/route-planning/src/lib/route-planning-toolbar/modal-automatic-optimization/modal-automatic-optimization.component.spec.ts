import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAutomaticOptimizationComponent } from './modal-automatic-optimization.component';

describe('ModalAutomaticOptimizationComponent', () => {
  let component: ModalAutomaticOptimizationComponent;
  let fixture: ComponentFixture<ModalAutomaticOptimizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAutomaticOptimizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAutomaticOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
