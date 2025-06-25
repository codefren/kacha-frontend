import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNoteListComponent } from './my-note-list.component';

describe('MyNoteListComponent', () => {
  let component: MyNoteListComponent;
  let fixture: ComponentFixture<MyNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
