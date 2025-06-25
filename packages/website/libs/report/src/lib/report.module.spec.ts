import { async, TestBed } from '@angular/core/testing';
import { ReportModule } from './report.module';

describe('ReportModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReportModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(ReportModule).toBeDefined();
    });
});
