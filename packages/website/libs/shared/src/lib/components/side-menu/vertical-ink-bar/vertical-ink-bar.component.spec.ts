import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalInkBarComponent } from './vertical-ink-bar.component';

describe('VerticalInkBarComponent', () => {
  let component: VerticalInkBarComponent;
  let fixture: ComponentFixture<VerticalInkBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalInkBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalInkBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
