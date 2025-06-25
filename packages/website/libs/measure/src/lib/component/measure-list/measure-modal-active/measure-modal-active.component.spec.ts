import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureModalActiveComponent } from './measure-modal-active.component';

describe('MeasureModalActiveComponent', () => {
  let component: MeasureModalActiveComponent;
  let fixture: ComponentFixture<MeasureModalActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureModalActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureModalActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
