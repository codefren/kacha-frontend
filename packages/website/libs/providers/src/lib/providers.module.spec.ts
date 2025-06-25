import { async, TestBed } from '@angular/core/testing';
import { ProvidersModule } from './providers.module';

describe('ProvidersModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ProvidersModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(ProvidersModule).toBeDefined();
    });
});
