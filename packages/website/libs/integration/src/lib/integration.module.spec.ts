import { async, TestBed } from '@angular/core/testing';
import { IntegrationModule } from './integration.module';

describe('IntegrationModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IntegrationModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(IntegrationModule).toBeDefined();
    });
});
