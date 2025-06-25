import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveRouteComponent } from './save-route.component';

describe('SaveRouteComponent', () => {
  let component: SaveRouteComponent;
  let fixture: ComponentFixture<SaveRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
