import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureGeneralListComponent } from './measure-general-list.component';

describe('MeasureGeneralListComponent', () => {
  let component: MeasureGeneralListComponent;
  let fixture: ComponentFixture<MeasureGeneralListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureGeneralListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureGeneralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
