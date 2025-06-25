import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionModuleModalComponent } from './description-module-modal.component';

describe('DescriptionModuleModalComponent', () => {
  let component: DescriptionModuleModalComponent;
  let fixture: ComponentFixture<DescriptionModuleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionModuleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionModuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
