import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOpenClientsComponent } from './modal-open-clients.component';

describe('ModalOpenClientsComponent', () => {
  let component: ModalOpenClientsComponent;
  let fixture: ComponentFixture<ModalOpenClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOpenClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOpenClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
