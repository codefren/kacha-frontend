import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEndRoutesComponent } from './modal-end-routes.component';

describe('ModalEndRoutesComponent', () => {
  let component: ModalEndRoutesComponent;
  let fixture: ComponentFixture<ModalEndRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEndRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEndRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
