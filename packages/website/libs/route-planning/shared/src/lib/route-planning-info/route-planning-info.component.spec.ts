import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutePlanningInfoComponent } from './route-planning-info.component';

describe('RouteInfoComponent', () => {
    let component: RoutePlanningInfoComponent;
    let fixture: ComponentFixture<RoutePlanningInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoutePlanningInfoComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoutePlanningInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
