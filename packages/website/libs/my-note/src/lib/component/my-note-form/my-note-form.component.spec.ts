import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNoteFormComponent } from './my-note-form.component';

describe('MyNoteFormComponent', () => {
  let component: MyNoteFormComponent;
  let fixture: ComponentFixture<MyNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
