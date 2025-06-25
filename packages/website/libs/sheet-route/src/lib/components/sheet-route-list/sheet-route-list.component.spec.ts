import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetRouteListComponent } from './sheet-route-list.component';

describe('SheetRouteListComponent', () => {
  let component: SheetRouteListComponent;
  let fixture: ComponentFixture<SheetRouteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetRouteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetRouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
