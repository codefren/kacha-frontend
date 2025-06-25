import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureGeneralComponent } from './measure-general.component';

describe('MeasureGeneralComponent', () => {
  let component: MeasureGeneralComponent;
  let fixture: ComponentFixture<MeasureGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
