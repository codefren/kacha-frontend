import { async, TestBed } from '@angular/core/testing';
import { CostModule } from './cost.module';

describe('CostModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CostModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(CostModule).toBeDefined();
    });
});
