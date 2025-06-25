import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditCostActualComponent } from './modal-edit-cost-actual.component';

describe('ModalEditCostActualComponent', () => {
  let component: ModalEditCostActualComponent;
  let fixture: ComponentFixture<ModalEditCostActualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditCostActualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditCostActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
