import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningMapComponent } from './route-planning-map.component';

describe('RoutePlanningMapComponent', () => {
  let component: RoutePlanningMapComponent;
  let fixture: ComponentFixture<RoutePlanningMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlanningMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlanningMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
