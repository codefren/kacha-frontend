import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutePlanningSubzonesComponent } from './route-planning-subzones.component';

describe('RoutePlanningSubzones', () => {
    let component: RoutePlanningSubzonesComponent;
    let fixture: ComponentFixture<RoutePlanningSubzonesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoutePlanningSubzonesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoutePlanningSubzonesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
