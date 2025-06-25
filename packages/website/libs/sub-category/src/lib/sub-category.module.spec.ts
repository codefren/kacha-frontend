import { async, TestBed } from '@angular/core/testing';
import { SubCategoryModule } from './sub-category.module';

describe('SubCategoryModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SubCategoryModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(SubCategoryModule).toBeDefined();
    });
});
