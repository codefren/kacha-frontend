import { async, TestBed } from '@angular/core/testing';
import { RoutePlanningSharedModule } from './route-planning-shared.module';

describe('RoutePlanningSharedModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RoutePlanningSharedModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(RoutePlanningSharedModule).toBeDefined();
    });
});
