import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMultiIntegrationComponent } from './modal-multi-integration.component';

describe('ModalMultiIntegrationComponent', () => {
  let component: ModalMultiIntegrationComponent;
  let fixture: ComponentFixture<ModalMultiIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMultiIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMultiIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
