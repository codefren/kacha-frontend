import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanningActionsComponent } from './route-planning-actions.component';

describe('RouteActionsComponent', () => {
    let component: RoutePlanningActionsComponent;
    let fixture: ComponentFixture<RoutePlanningActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoutePlanningActionsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoutePlanningActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
