import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningComponent } from './route-planning.component';

describe('RoutePlanningComponent', () => {
  let component: RoutePlanningComponent;
  let fixture: ComponentFixture<RoutePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
