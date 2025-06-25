import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOrdersComponent } from './summary-orders.component';

describe('SummaryOrdersComponent', () => {
  let component: SummaryOrdersComponent;
  let fixture: ComponentFixture<SummaryOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
