import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetRouteFormComponent } from './sheet-route-form.component';

describe('SheetRouteFormComponent', () => {
  let component: SheetRouteFormComponent;
  let fixture: ComponentFixture<SheetRouteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetRouteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetRouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
