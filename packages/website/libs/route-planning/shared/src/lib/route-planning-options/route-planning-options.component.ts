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
} from '@optimroute/state-route-planning';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material';
import { FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
import { Validator } from 'class-validator';
import { VehiclesFacade } from '@optimroute/state-vehicles';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null,
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched || isSubmitted)
        );
    }
}

@Component({
    selector: 'easyroute-route-planning-options',
    templateUrl: './route-planning-options.component.html',
    styleUrls: ['./route-planning-options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class RoutePlanningOptionsComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    zoneId: number;

    @Input()
    routeId: number;

    @Input()
    useOrderedParameters: boolean;

    dischargingHours: number = 0;

    dischargingMinutes: number = 0;

    dischargingSeconds: number = 0;

    recomputeFromIndexFormControl = new FormControl(1, [Validators.required]);

    matcher = new MyErrorStateMatcher();

    planningSession$: Observable<PlanningSession>;
    route$: Observable<Route>;
    zoneState$: Observable<PlanningDeliveryZone>;
    optimizationParameters$;

    enabledParameters: { name: string; value: number }[];
    disabledParameters: { name: string; value: number }[];
    freeParameters: { name: string; value: number }[];

    zone: PlanningDeliveryZone;
    route: Route;

    unsubscribe$ = new Subject<void>();

    // ZONES FUNCTIONS
    saveDeliveryScheduleValue(value: { startOrEnd: string; value: number }) {
        switch (value.startOrEnd) {
            case 'start': {
                this.facade.updateDeliveryScheduleStart(this.zoneId, value.value);
                break;
            }
            case 'end': {
                this.facade.updateDeliveryScheduleEnd(this.zoneId, value.value);
                break;
            }
        }
    }
    toggleForceDepartureValue(value: boolean) {
        this.facade.toggleForceDepartureValue(this.zoneId, value);
    }

    updateOptimizationParameters(optimizationParameters: Partial<OptimizationParameters>) {
        this.facade.updateOptimizationParameters(this.zoneId, optimizationParameters);
    }

    updateExplorationLevel(newExplorationLevel: number) {
        this.facade.updateExplorationLevel(this.zoneId, newExplorationLevel);
    }

    changeMaxDelayTime(value) {
        let time: number =
            this.dischargingHours * 3600 +
            this.dischargingMinutes * 60 +
            this.dischargingSeconds;
        this.facade.updateMaxDelayTime(this.zoneId, time);
    }

    // ROUTE FUNCTIONS

    saveRouteDeliveryScheduleValue(value: { startOrEnd: string; value: number }) {
        switch (value.startOrEnd) {
            case 'start': {
                this.facade.updateRouteDeliveryScheduleStart(
                    this.zoneId,
                    this.routeId,
                    value.value,
                );
                break;
            }
            case 'end': {
                this.facade.updateRouteDeliveryScheduleEnd(
                    this.zoneId,
                    this.routeId,
                    value.value,
                );
                break;
            }
        }
    }
    toggleRouteForceDepartureValue(value: boolean) {
        this.facade.toggleRouteForceDepartureValue(this.zoneId, this.routeId, value);
    }

    updateRouteOptimizationParameters(
        optimizationParameters: Partial<OptimizationParameters>,
    ) {
        this.facade.updateRouteOptimizationParameters(
            this.zoneId,
            this.routeId,
            optimizationParameters,
        );
    }

    updateRouteExplorationLevel(newExplorationLevel: number) {
        this.facade.updateRouteExplorationLevel(
            this.zoneId,
            this.routeId,
            newExplorationLevel,
        );
    }

    updateOptimizeFromIndex(value: number) {
        if (!this.recomputeFromIndexFormControl.invalid) {
            this.facade.updateOptimizeFromIndex(this.zoneId, this.routeId, +value);
        }
    }

    constructor(private facade: RoutePlanningFacade) {}

    ngOnInit() {
        this.planningSession$ = this.facade.planningSession$;
        if (this.routeId === undefined) {
            this.zoneState$ = this.facade.getZoneById(this.zoneId);
            this.facade
                .getZoneOptimizationParameters(this.zoneId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((optimizationParameters: any) => { 
                    const params: {
                        numVehicles: number;
                        travelDistance: number;
                        customerSatisfaction: number;
                        vehicleTimeBalance: number;
                        maxDelayTime: number;
                    } = optimizationParameters.preference;
                    this.enabledParameters = [];
                    this.disabledParameters = [];
                    this.freeParameters = [];
                    for (const key in params) {
                        const object = { name: key, value: params[key] ? params[key] : 0  };
                        if (this.useOrderedParameters) {
                            if (params[key] === -1) this.disabledParameters.push(object);
                            else this.enabledParameters.push(object);
                        } else this.freeParameters.push(object);
                    }
                });
            this.facade
                .getZoneMaxDelayTime(this.zoneId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((maxDelayTime: number) => {
                    let totalSeconds = maxDelayTime;
                    this.dischargingHours = Math.floor(maxDelayTime / 3600);
                    totalSeconds %= 3600;
                    this.dischargingMinutes = Math.floor(totalSeconds / 60);
                    this.dischargingSeconds = totalSeconds % 60;
                });
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
            if (this.routeId !== undefined) {
                this.route$ = this.facade.getZoneRouteById(this.zoneId, this.routeId);
                this.facade
                    .getZoneRouteById(this.zoneId, this.routeId)
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((route: Route) => {
                        if (route) {
                            const params: {
                                numVehicles: number;
                                travelDistance: number;
                                customerSatisfaction: number;
                                vehicleTimeBalance: number;
                            } = route.settings.optimizationParameters.preference;
                            this.enabledParameters = [];
                            this.disabledParameters = [];
                            this.freeParameters = [];
                            for (const key in params) {
                                const object = { name: key, value: params[key] };
                                if (this.useOrderedParameters) {
                                    if (params[key] === -1)
                                        this.disabledParameters.push(object);
                                    else this.enabledParameters.push(object);
                                } else this.freeParameters.push(object);
                            }
                        }
                    });
            }
        }
    }
}
