import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsPlanningComponent } from './visits-planning.component';

describe('VisitsPlanningComponent', () => {
  let component: VisitsPlanningComponent;
  let fixture: ComponentFixture<VisitsPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitsPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitsPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
