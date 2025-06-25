import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishAssignateComponent } from './finish-assignate.component';

describe('FinishAssignateComponent', () => {
  let component: FinishAssignateComponent;
  let fixture: ComponentFixture<FinishAssignateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishAssignateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishAssignateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
