import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesDeliveryNotesComponent } from './preferences-delivery-notes.component';

describe('PreferencesDeliveryNotesComponent', () => {
  let component: PreferencesDeliveryNotesComponent;
  let fixture: ComponentFixture<PreferencesDeliveryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencesDeliveryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesDeliveryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
