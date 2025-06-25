import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsLinkedTableComponent } from './clients-linked-table.component';

describe('ClientsLinkedTableComponent', () => {
  let component: ClientsLinkedTableComponent;
  let fixture: ComponentFixture<ClientsLinkedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsLinkedTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsLinkedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
