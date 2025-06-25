import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPromotionImgInfoComponent } from './modal-promotion-img-info.component';

describe('ModalPromotionImgInfoComponent', () => {
  let component: ModalPromotionImgInfoComponent;
  let fixture: ComponentFixture<ModalPromotionImgInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPromotionImgInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPromotionImgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
