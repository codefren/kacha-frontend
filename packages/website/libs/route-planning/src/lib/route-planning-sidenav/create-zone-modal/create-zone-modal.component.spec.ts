import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateZoneModalComponent } from './create-zone-modal.component';

describe('CreateZoneModalComponent', () => {
  let component: CreateZoneModalComponent;
  let fixture: ComponentFixture<CreateZoneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateZoneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateZoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
