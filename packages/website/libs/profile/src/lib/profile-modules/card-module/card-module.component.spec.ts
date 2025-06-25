import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardModuleComponent } from './card-module.component';

describe('CardModuleComponent', () => {
  let component: CardModuleComponent;
  let fixture: ComponentFixture<CardModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
