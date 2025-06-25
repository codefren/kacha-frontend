import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleClientsFormComponent } from './schedule-clients-form.component';

describe('ScheduleClientsFormComponent', () => {
  let component: ScheduleClientsFormComponent;
  let fixture: ComponentFixture<ScheduleClientsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleClientsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleClientsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
