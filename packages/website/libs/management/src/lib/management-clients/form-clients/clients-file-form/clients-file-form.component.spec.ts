import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsFileFormComponent } from './clients-file-form.component';

describe('ClientsFileFormComponent', () => {
  let component: ClientsFileFormComponent;
  let fixture: ComponentFixture<ClientsFileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsFileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
