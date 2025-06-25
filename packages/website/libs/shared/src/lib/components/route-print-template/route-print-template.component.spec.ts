import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePrintTemplateComponent } from './route-print-template.component';

describe('RoutePrintTemplateComponent', () => {
  let component: RoutePrintTemplateComponent;
  let fixture: ComponentFixture<RoutePrintTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePrintTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePrintTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
