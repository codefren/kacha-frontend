import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveMultipleDeliveryPointOptimizedComponent } from './move-multiple-delivery-point-optimized.component';

describe('MoveMultipleDeliveryPointOptimizedComponent', () => {
  let component: MoveMultipleDeliveryPointOptimizedComponent;
  let fixture: ComponentFixture<MoveMultipleDeliveryPointOptimizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveMultipleDeliveryPointOptimizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveMultipleDeliveryPointOptimizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
