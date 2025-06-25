import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureGeneralFormComponent } from './measure-general-form.component';

describe('MeasureGeneralFormComponent', () => {
  let component: MeasureGeneralFormComponent;
  let fixture: ComponentFixture<MeasureGeneralFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureGeneralFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureGeneralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
