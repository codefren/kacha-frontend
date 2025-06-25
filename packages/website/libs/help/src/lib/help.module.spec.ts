import { async, TestBed } from '@angular/core/testing';
import { HelpModule } from './help.module';

describe('HelpModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HelpModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(HelpModule).toBeDefined();
    });
});
