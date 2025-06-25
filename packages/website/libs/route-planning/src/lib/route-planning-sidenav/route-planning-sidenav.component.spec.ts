import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningSidenavComponent } from './route-planning-sidenav.component';

describe('RoutePlanningSidenavComponent', () => {
  let component: RoutePlanningSidenavComponent;
  let fixture: ComponentFixture<RoutePlanningSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlanningSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlanningSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
