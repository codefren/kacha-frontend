import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningOptionsComponent } from './route-planning-options.component';

describe('ZoneOptionsComponent', () => {
    let component: RoutePlanningOptionsComponent;
    let fixture: ComponentFixture<RoutePlanningOptionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoutePlanningOptionsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoutePlanningOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
