import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRoutesComponent } from './modal-routes.component';

describe('ModalRoutesComponent', () => {
  let component: ModalRoutesComponent;
  let fixture: ComponentFixture<ModalRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
