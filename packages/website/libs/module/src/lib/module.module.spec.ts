import { async, TestBed } from '@angular/core/testing';
import { ModuleModule } from './module.module';

describe('ModuleModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ModuleModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(ModuleModule).toBeDefined();
    });
});
