import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryNotesComponent } from './delivery-notes.component';

describe('DeliveryNotesComponent', () => {
  let component: DeliveryNotesComponent;
  let fixture: ComponentFixture<DeliveryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
