import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntegrationConfirmDeleteZonesComponent } from './modal-integration-confirm-delete-zones.component';

describe('ModalIntegrationConfirmDeleteZonesComponent', () => {
  let component: ModalIntegrationConfirmDeleteZonesComponent;
  let fixture: ComponentFixture<ModalIntegrationConfirmDeleteZonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIntegrationConfirmDeleteZonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntegrationConfirmDeleteZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
