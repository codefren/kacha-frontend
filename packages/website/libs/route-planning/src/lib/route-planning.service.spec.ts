import { TestBed } from '@angular/core/testing';

import { RoutePlanningService } from './route-planning.service';

describe('RoutePlanningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutePlanningService = TestBed.get(RoutePlanningService);
    expect(service).toBeTruthy();
  });
});
