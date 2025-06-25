import { async, TestBed } from '@angular/core/testing';
import { RoutePlanningModule } from './route-planning.module';

describe('RoutePlanningModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RoutePlanningModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(RoutePlanningModule).toBeDefined();
    });
});
