import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActiveClientComponent } from './modal-active-client.component';

describe('ModalActiveClientComponent', () => {
  let component: ModalActiveClientComponent;
  let fixture: ComponentFixture<ModalActiveClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalActiveClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalActiveClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
