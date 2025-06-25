import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMiwigoAccountComponent } from './verify-miwigo-account.component';

describe('VerifyMiwigoAccountComponent', () => {
  let component: VerifyMiwigoAccountComponent;
  let fixture: ComponentFixture<VerifyMiwigoAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyMiwigoAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMiwigoAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
