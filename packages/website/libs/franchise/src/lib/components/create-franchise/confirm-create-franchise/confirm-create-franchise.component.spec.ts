import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCreateFranchiseComponent } from './confirm-create-franchise.component';

describe('ConfirmCreateFranchiseComponent', () => {
  let component: ConfirmCreateFranchiseComponent;
  let fixture: ComponentFixture<ConfirmCreateFranchiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCreateFranchiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCreateFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
