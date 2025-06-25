import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenModuleModalComponent } from './open-module-modal.component';

describe('OpenModuleModalComponent', () => {
  let component: OpenModuleModalComponent;
  let fixture: ComponentFixture<OpenModuleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenModuleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenModuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
