import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntegrationFavoritesComponent } from './modal-integration-favorites.component';

describe('ModalIntegrationFavoritesComponent', () => {
  let component: ModalIntegrationFavoritesComponent;
  let fixture: ComponentFixture<ModalIntegrationFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIntegrationFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntegrationFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
