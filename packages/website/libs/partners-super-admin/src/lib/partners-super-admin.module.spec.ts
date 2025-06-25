import { async, TestBed } from '@angular/core/testing';
import { PartnersSuperAdminModule } from './partners-super-admin.module';

describe('PartnersSuperAdminModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PartnersSuperAdminModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(PartnersSuperAdminModule).toBeDefined();
    });
});
