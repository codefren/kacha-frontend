import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteIntegrationComponent } from './route-integration.component';

describe('RouteIntegrationComponent', () => {
  let component: RouteIntegrationComponent;
  let fixture: ComponentFixture<RouteIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
