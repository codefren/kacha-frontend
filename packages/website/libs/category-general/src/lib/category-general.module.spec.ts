import { async, TestBed } from '@angular/core/testing';
import { CategoryGeneralModule } from './category-general.module';

describe('CategoryGeneralModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CategoryGeneralModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(CategoryGeneralModule).toBeDefined();
    });
});
