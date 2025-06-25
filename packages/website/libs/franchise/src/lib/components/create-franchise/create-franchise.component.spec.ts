import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFranchiseComponent } from './create-franchise.component';

describe('CreateFranchiseComponent', () => {
  let component: CreateFranchiseComponent;
  let fixture: ComponentFixture<CreateFranchiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFranchiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
