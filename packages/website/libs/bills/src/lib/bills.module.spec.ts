import { async, TestBed } from '@angular/core/testing';
import { BillsModule } from './bills.module';

describe('BillsModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BillsModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(BillsModule).toBeDefined();
    });
});
