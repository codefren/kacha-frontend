import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalClientsComponent } from './total-clients.component';

describe('TotalClientsComponent', () => {
  let component: TotalClientsComponent;
  let fixture: ComponentFixture<TotalClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
