import { async, TestBed } from '@angular/core/testing';
import { FranchiseModule } from './franchise.module';

describe('FranchiseModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FranchiseModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(FranchiseModule).toBeDefined();
    });
});
