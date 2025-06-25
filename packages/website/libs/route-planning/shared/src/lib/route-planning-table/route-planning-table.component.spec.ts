import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningTableComponent } from './route-planning-table.component';

describe('ZoneRouteTableComponent', () => {
    let component: RoutePlanningTableComponent;
    let fixture: ComponentFixture<RoutePlanningTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoutePlanningTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoutePlanningTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
