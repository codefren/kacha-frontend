import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDefaultCardComponent } from './confirm-default-card.component';

describe('ConfirmDefaultCardComponent', () => {
  let component: ConfirmDefaultCardComponent;
  let fixture: ComponentFixture<ConfirmDefaultCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDefaultCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDefaultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
