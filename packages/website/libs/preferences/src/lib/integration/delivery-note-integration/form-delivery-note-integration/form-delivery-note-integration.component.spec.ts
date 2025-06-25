import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDeliveryNoteIntegrationComponent } from './form-delivery-note-integration.component';

describe('FormDeliveryNoteIntegrationComponent', () => {
  let component: FormDeliveryNoteIntegrationComponent;
  let fixture: ComponentFixture<FormDeliveryNoteIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDeliveryNoteIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDeliveryNoteIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
