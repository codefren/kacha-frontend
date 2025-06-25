import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryRoutesComponent } from './history-routes.component';

describe('HistoryRoutesComponent', () => {
  let component: HistoryRoutesComponent;
  let fixture: ComponentFixture<HistoryRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
