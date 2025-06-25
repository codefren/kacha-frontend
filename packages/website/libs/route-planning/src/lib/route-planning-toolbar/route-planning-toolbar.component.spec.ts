import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningToolbarComponent } from './route-planning-toolbar.component';

describe('RoutePlanningToolbarComponent', () => {
  let component: RoutePlanningToolbarComponent;
  let fixture: ComponentFixture<RoutePlanningToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlanningToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlanningToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
