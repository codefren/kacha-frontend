import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntegrationComponent } from './modal-integration.component';

describe('ModalIntegrationComponent', () => {
  let component: ModalIntegrationComponent;
  let fixture: ComponentFixture<ModalIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
