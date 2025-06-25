import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecoverOptimizationComponent } from './modal-recover-optimization.component';

describe('ModalRecoverOptimizationComponent', () => {
  let component: ModalRecoverOptimizationComponent;
  let fixture: ComponentFixture<ModalRecoverOptimizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRecoverOptimizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRecoverOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
