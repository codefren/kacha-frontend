import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignProductsFranchiseComponent } from './asign-products-franchise.component';

describe('AsignProductsFranchiseComponent', () => {
  let component: AsignProductsFranchiseComponent;
  let fixture: ComponentFixture<AsignProductsFranchiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignProductsFranchiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignProductsFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
