import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorationPreferenceComponent } from './valoration-preference.component';

describe('ValorationPreferenceComponent', () => {
  let component: ValorationPreferenceComponent;
  let fixture: ComponentFixture<ValorationPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValorationPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValorationPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
