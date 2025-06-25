import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartListComponent } from './start-list.component';

describe('StartListComponent', () => {
  let component: StartListComponent;
  let fixture: ComponentFixture<StartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
