import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalDocumentComponent } from './user-modal-document.component';

describe('UserModalDocumentComponent', () => {
  let component: UserModalDocumentComponent;
  let fixture: ComponentFixture<UserModalDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserModalDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
