import { async, TestBed } from '@angular/core/testing';
import { ManagementModule } from './management.module';

describe('ManagementModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ManagementModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(ManagementModule).toBeDefined();
    });
});
