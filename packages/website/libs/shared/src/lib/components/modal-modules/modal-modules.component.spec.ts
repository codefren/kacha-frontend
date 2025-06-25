import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModulesComponent } from './modal-modules.component';

describe('ModalModulesComponent', () => {
  let component: ModalModulesComponent;
  let fixture: ComponentFixture<ModalModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
