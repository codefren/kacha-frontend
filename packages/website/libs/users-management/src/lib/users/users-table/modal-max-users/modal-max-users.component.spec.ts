import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMaxUsersComponent } from './modal-max-users.component';

describe('ModalMaxUsersComponent', () => {
  let component: ModalMaxUsersComponent;
  let fixture: ComponentFixture<ModalMaxUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMaxUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMaxUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
