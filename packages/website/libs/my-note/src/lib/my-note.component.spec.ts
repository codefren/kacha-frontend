import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNoteComponent } from './my-note.component';

describe('MyNoteComponent', () => {
  let component: MyNoteComponent;
  let fixture: ComponentFixture<MyNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
