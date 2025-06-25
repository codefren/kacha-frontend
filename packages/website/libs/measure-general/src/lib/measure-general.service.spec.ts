import { TestBed } from '@angular/core/testing';

import { MeasureGeneralService } from './measure-general.service';

describe('MeasureGeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeasureGeneralService = TestBed.get(MeasureGeneralService);
    expect(service).toBeTruthy();
  });
});
