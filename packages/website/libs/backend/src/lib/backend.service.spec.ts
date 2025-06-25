import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BackendService } from './backend.service';
import { inject } from '@angular/core/testing';

describe('BackendService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BackendService],
        }),
    );

    it('should be created', inject([BackendService], (service: BackendService) => {
        expect(service).toBeTruthy();
    }));
});
