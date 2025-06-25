import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntegrationAddPointsComponent } from './modal-integration-add-points.component';

describe('ModalIntegrationAddPointsComponent', () => {
  let component: ModalIntegrationAddPointsComponent;
  let fixture: ComponentFixture<ModalIntegrationAddPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIntegrationAddPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntegrationAddPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
