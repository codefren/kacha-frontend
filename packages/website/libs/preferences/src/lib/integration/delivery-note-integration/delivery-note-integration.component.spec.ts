import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryNoteIntegrationComponent } from './delivery-note-integration.component';

describe('DeliveryNoteIntegrationComponent', () => {
  let component: DeliveryNoteIntegrationComponent;
  let fixture: ComponentFixture<DeliveryNoteIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryNoteIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryNoteIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
