import { async, TestBed } from '@angular/core/testing';
import { StateGeolocationModule } from './state-geolocation.module';

describe('StateGeolocationModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StateGeolocationModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(StateGeolocationModule).toBeDefined();
    });
});
