import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFormComponent } from './bill-form.component';

describe('BillFormComponent', () => {
  let component: BillFormComponent;
  let fixture: ComponentFixture<BillFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
