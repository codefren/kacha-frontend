import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClientNewComponent } from './modal-client-new.component';

describe('ModalClientNewComponent', () => {
  let component: ModalClientNewComponent;
  let fixture: ComponentFixture<ModalClientNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalClientNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalClientNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
