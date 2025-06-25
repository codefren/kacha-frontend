import { async, TestBed } from '@angular/core/testing';
import { PreferencesModule } from './preferences.module';

describe('PreferencesModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PreferencesModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(PreferencesModule).toBeDefined();
    });
});
