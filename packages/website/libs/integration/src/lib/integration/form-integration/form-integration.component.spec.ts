import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIntegrationComponent } from './form-integration.component';

describe('FormIntegrationComponent', () => {
  let component: FormIntegrationComponent;
  let fixture: ComponentFixture<FormIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
