import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNoteComponent } from './shared-note.component';

describe('SharedNoteComponent', () => {
  let component: SharedNoteComponent;
  let fixture: ComponentFixture<SharedNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
