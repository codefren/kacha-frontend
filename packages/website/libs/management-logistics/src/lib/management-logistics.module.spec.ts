import { async, TestBed } from '@angular/core/testing';
import { ManagementLogisticsModule } from './management-logistics.module';

describe('ManagementLogisticsModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ManagementLogisticsModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(ManagementLogisticsModule).toBeDefined();
    });
});
