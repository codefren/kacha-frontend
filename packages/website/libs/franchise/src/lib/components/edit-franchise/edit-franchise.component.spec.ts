import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFranchiseComponent } from './edit-franchise.component';

describe('EditFranchiseComponent', () => {
  let component: EditFranchiseComponent;
  let fixture: ComponentFixture<EditFranchiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFranchiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
