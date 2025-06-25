import { async, TestBed } from '@angular/core/testing';
import { CategoryModule } from './category.module';

describe('CategoryModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CategoryModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(CategoryModule).toBeDefined();
    });
});
