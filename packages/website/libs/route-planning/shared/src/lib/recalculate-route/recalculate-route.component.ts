import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import {
    OptimizationParameters,
    PlanningDeliveryZone,
    PlanningSession,
    Route,
    RoutePlanningFacade,
    DeliveryZoneStatus,
    RouteStatus,
} from '@optimroute/state-route-planning';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material';
import { FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
import { Validator } from 'class-validator';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null,
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid);
    }
}

@Component({
    selector: 'easyroute-recalculate-route',
    templateUrl: './recalculate-route.component.html',
    styleUrls: ['./recalculate-route.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class RecalculateRoute implements OnInit, OnDestroy, OnChanges {
    @Input()
    zoneId: number;

    @Input()
    routeId: number;

    @Input()
    zoneStatus: DeliveryZoneStatus;
    @Input()
    routesStatus: {
        [routeIdKey: number]: RouteStatus;
    };

    @Input()
    zoneOptimizationStatus$: Observable<{
        loading: boolean;
        progress: number;
        error?: string;
    }>;

    recomputeFromIndexFormControl = new FormControl(1, [Validators.required]);

    matcher = new MyErrorStateMatcher();

    planningSession$: Observable<PlanningSession>;
    route$: Observable<Route>;
    zoneState$: Observable<PlanningDeliveryZone>;

    zone: PlanningDeliveryZone;
    route: Route;

    unsubscribe$ = new Subject<void>();

    recompute() {
        if (this.routeId)
            this.facade.recompute({
                [this.routeId]: {
                    zoneId: this.zoneId,
                    routeId: this.routeId,
                    start: this.route.departureDayTime,
                },
            });
    }

    updateOptimizeFromIndex(value: number) {
        if (!this.recomputeFromIndexFormControl.invalid) {
            this.facade.updateOptimizeFromIndex(this.zoneId, this.routeId, +value);
        }
    }

    constructor(private facade: RoutePlanningFacade) {}

    ngOnInit() {
        this.planningSession$ = this.facade.planningSession$;
        this.zoneState$ = this.facade.getZoneById(this.zoneId);

        if (this.routeId) {
            this.route$ = this.facade.getZoneRouteById(this.zoneId, this.routeId);
            this.route$.pipe(take(1)).subscribe((route) => (this.route = route));
            this.facade.getZoneRouteById(this.zoneId, this.routeId);
        }
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (this.routeId !== null) {
            this.route$ = this.facade.getZoneRouteById(this.zoneId, this.routeId);
            this.route$.pipe(take(1)).subscribe((route) => (this.route = route));
            this.facade.getZoneRouteById(this.zoneId, this.routeId);
        }
    }
}
