import { TestBed } from '@angular/core/testing';

import { MyNoteService } from './my-note.service';

describe('MyNoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyNoteService = TestBed.get(MyNoteService);
    expect(service).toBeTruthy();
  });
});
