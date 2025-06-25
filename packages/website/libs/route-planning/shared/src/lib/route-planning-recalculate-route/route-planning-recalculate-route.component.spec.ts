import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecalculateRouteComponent } from './recalculate-route.component';

describe('RecalculateRouteComponent', () => {
  let component: RecalculateRouteComponent;
  let fixture: ComponentFixture<RecalculateRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecalculateRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecalculateRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
