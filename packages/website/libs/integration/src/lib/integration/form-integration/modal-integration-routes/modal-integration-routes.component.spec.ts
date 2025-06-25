import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntegrationRoutesComponent } from './modal-integration-routes.component';

describe('ModalIntegrationRoutesComponent', () => {
  let component: ModalIntegrationRoutesComponent;
  let fixture: ComponentFixture<ModalIntegrationRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIntegrationRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntegrationRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
