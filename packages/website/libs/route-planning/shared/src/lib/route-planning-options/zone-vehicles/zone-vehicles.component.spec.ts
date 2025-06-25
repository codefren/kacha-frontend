import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneVehiclesComponent } from './zone-vehicles.component';

describe('ZoneVehiclesComponent', () => {
    let component: ZoneVehiclesComponent;
    let fixture: ComponentFixture<ZoneVehiclesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ZoneVehiclesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ZoneVehiclesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
