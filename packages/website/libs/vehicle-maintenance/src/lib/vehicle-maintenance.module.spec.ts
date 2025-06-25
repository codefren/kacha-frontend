import { async, TestBed } from '@angular/core/testing';
import { VehicleMaintenanceModule } from './vehicle-maintenance.module';

describe('VehicleMaintenanceModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [VehicleMaintenanceModule],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(VehicleMaintenanceModule).toBeDefined();
    });
});
