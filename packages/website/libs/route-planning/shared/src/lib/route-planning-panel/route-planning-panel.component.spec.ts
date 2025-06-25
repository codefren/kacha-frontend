import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningPanelComponent } from './route-planning-panel.component';

describe('RoutePlanningPanelComponent', () => {
  let component: RoutePlanningPanelComponent;
  let fixture: ComponentFixture<RoutePlanningPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlanningPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlanningPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
