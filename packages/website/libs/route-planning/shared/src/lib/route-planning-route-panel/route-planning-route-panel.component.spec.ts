import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningRoutePanelComponent } from './route-planning-route-panel.component';

describe('RoutePlanningRoutePanelComponent', () => {
  let component: RoutePlanningRoutePanelComponent;
  let fixture: ComponentFixture<RoutePlanningRoutePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlanningRoutePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlanningRoutePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
