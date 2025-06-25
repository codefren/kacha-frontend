import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagementClientsTableComponent } from './magement-clients-table.component';

describe('MagementClientsTableComponent', () => {
  let component: MagementClientsTableComponent;
  let fixture: ComponentFixture<MagementClientsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagementClientsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagementClientsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
