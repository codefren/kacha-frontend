import { async, TestBed } from '@angular/core/testing';
import { CategoryFilterModule } from './category-filter.module';

describe('CategoryFilterModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CategoryFilterModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(CategoryFilterModule).toBeDefined();
    });
});
