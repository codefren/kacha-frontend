import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewDeliveryPointComponent } from './image-view-delivery-point.component';

describe('ImageViewDeliveryPointComponent', () => {
  let component: ImageViewDeliveryPointComponent;
  let fixture: ComponentFixture<ImageViewDeliveryPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewDeliveryPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewDeliveryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
