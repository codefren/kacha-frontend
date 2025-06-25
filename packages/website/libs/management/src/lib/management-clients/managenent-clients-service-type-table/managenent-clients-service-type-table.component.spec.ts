import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagenentClientsServiceTypeTableComponent } from './managenent-clients-service-type-table.component';

describe('ManagenentClientsServiceTypeTableComponent', () => {
  let component: ManagenentClientsServiceTypeTableComponent;
  let fixture: ComponentFixture<ManagenentClientsServiceTypeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagenentClientsServiceTypeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagenentClientsServiceTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
