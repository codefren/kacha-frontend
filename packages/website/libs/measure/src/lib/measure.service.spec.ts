import { TestBed } from '@angular/core/testing';

import { MeasureService } from './measure.service';

describe('MeasureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeasureService = TestBed.get(MeasureService);
    expect(service).toBeTruthy();
  });
});
