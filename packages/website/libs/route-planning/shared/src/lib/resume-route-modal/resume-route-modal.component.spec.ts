import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeRouteModalComponent } from './resume-route-modal.component';

describe('ResumeRouteModalComponent', () => {
  let component: ResumeRouteModalComponent;
  let fixture: ComponentFixture<ResumeRouteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeRouteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeRouteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
