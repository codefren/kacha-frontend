import { async, TestBed } from '@angular/core/testing';
import { SheetRouteModule } from './sheet-route.module';

describe('SheetRouteModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SheetRouteModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(SheetRouteModule).toBeDefined();
    });
});
