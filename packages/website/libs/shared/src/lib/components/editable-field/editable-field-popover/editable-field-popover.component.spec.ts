import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableFieldPopoverComponent } from './editable-field-popover.component';

describe('EditableFieldPopoverComponent', () => {
  let component: EditableFieldPopoverComponent;
  let fixture: ComponentFixture<EditableFieldPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableFieldPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableFieldPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
