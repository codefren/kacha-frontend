import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrossDockingComponent } from './add-cross-docking.component';

describe('AddCrossDockingComponent', () => {
  let component: AddCrossDockingComponent;
  let fixture: ComponentFixture<AddCrossDockingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrossDockingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrossDockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
