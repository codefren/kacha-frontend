import { TestBed, async, inject } from '@angular/core/testing';

import { PartnersAdminGuard } from './partners-admin.guard';

describe('PartnersAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartnersAdminGuard]
    });
  });

  it('should ...', inject([PartnersAdminGuard], (guard: PartnersAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
