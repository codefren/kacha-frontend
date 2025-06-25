import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewsComponent } from './image-views.component';

describe('ImageViewsComponent', () => {
  let component: ImageViewsComponent;
  let fixture: ComponentFixture<ImageViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
