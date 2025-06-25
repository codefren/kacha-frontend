import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseAndStorageComponent } from './use-and-storage.component';

describe('UseAndStorageComponent', () => {
  let component: UseAndStorageComponent;
  let fixture: ComponentFixture<UseAndStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseAndStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseAndStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
