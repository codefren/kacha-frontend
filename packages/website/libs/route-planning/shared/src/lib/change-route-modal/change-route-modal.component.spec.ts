import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRouteModalComponent } from './change-route-modal.component';

describe('ChangeRouteModalComponent', () => {
  let component: ChangeRouteModalComponent;
  let fixture: ComponentFixture<ChangeRouteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRouteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRouteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
