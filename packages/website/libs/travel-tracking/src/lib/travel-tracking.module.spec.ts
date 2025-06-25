import { async, TestBed } from '@angular/core/testing';
import { TravelTrackingModule } from './travel-tracking.module';

describe('TravelTrackingModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TravelTrackingModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(TravelTrackingModule).toBeDefined();
    });
});
