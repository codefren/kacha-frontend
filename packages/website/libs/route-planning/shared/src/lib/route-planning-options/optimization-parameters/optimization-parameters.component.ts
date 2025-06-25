import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    SimpleChanges,
    OnChanges,
    OnDestroy,
} from '@angular/core';
import {
    RoutePlanningFacade,
    OptimizationParameters,
    PlanningDeliveryZone,
} from '@optimroute/state-route-planning';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare var init_plugins: any;
@Component({
    selector: 'easyroute-optimization-parameters',
    templateUrl: './optimization-parameters.component.html',
    styleUrls: ['./optimization-parameters.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OptimizationParametersComponent implements OnInit, OnDestroy {
    @Input() enabledParameters: { name: string; value: number }[];

    @Input() disabledParameters: { name: string; value: number }[];

    @Input() useOrderedParameters: boolean = true;

    @Input() freeParameters: { name: string; value: number }[];
    _freeParameters: { name: string; value: number }[];

    @Input() planningDeliveryZone: PlanningDeliveryZone;

    @Input() routeId: number;

    @Input() zoneId: number;

    @Output() updateOptimizationParameters = new EventEmitter();

    dischargingHours: number = 0;

    dischargingMinutes: number = 0;

    dischargingSeconds: number = 0;

    unsubscribe$ = new Subject<void>();

    updateSliderValue(pos: number) {
        this.updateOptimizationParameters.emit({
            preference: {
                [this._freeParameters[pos].name]: this._freeParameters[pos].value,
            },
        });
    }

    updateExplorationLevel(newExplorationLevel: number) {
        this.facade.updateExplorationLevel(this.planningDeliveryZone.id, newExplorationLevel);
    }

    toggleIgnoreCapacityLimit(value: boolean) {
        this.facade.toggleIgnoreCapacityLimit(this.planningDeliveryZone.id, value);
    }


    getParamName(name: string) {
        switch (name) {
            case 'numVehicles':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.NUM_VEHICLES';
            case 'travelDistance':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.TRAVEL_DISTANCE';
            case 'customerSatisfaction':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.CUSTOMER_SATISFACTION';
            case 'vehicleTimeBalance':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.ROUTE_BALANCE';
            
            case 'costDistance':
                //return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.COST_DISTANCE';
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.DISTANCE';
        
            case 'costDuration':
                //return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.COST_DURATION';
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.DURATION';

            case 'costVehicleWaitTime':
                //return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.COST_VEHICLE_WAIT_TIME';
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.VEHICLE_WAIT_TIME';
        }
    }

    getParamDescription( name: string ) {
        switch( name ) {
            case 'numVehicles':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.NUM_VEHICLES';
            case 'travelDistance':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.TRAVEL_DISTANCE';
            case 'customerSatisfaction':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.CUSTOMER_SATISFACTION';
            case 'vehicleTimeBalance':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.ROUTE_BALANCE';
            
            case 'costDistance':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.COST_DISTANCE_MESSAGE';
        
            case 'costDuration':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.COST_DURATION_MESSAGE';

            case 'costVehicleWaitTime':
                return 'ROUTE_PLANNING.ZONE.SETTINGS.PARAMETERS_TO_OPTIMIZE.COST_VEHICLE_WAIT_TIME_MESSAGE';
        }
    }

    changeMaxDelayTime(value) {
        let time: number =
            this.dischargingHours * 3600 +
            this.dischargingMinutes * 60 +
            this.dischargingSeconds;
        this.facade.updateMaxDelayTime(this.planningDeliveryZone.id, time);
    }

    droppedInEnabled(event: CdkDragDrop<string[]>) {
        let newOptimizationParameters = {};
        if (event.previousContainer.id === 'enabled-optimization-parameters-list') {
            // const elementBeingMoved = this.enabledParameters[event.previousIndex];
            let i = 0;
            for (const enabledParameter of this.enabledParameters) {
                enabledParameter.value = i;
                newOptimizationParameters[enabledParameter.name] = enabledParameter.value;
                i++;
            }
            newOptimizationParameters[this.disabledParameters[event.previousIndex].name] =
                event.currentIndex;
            for (const disabledParameter of this.enabledParameters) {
                newOptimizationParameters[disabledParameter.name] = -1;
            }
        } else if (event.previousContainer.id === 'disabled-optimization-parameters-list') {
            for (const enabledParameter of this.enabledParameters) {
                if (enabledParameter.value > event.currentIndex) {
                    enabledParameter.value++;
                }
                newOptimizationParameters[enabledParameter.name] = enabledParameter.value;
            }
            newOptimizationParameters[this.disabledParameters[event.previousIndex].name] =
                event.currentIndex;
            for (const disabledParameter of this.enabledParameters) {
                newOptimizationParameters[disabledParameter.name] = -1;
            }
        }
        this.updateOptimizationParameters.emit({
            preference: newOptimizationParameters as any,
        });
    }

    droppedInDisabled(event: CdkDragDrop<string[]>) {
        let newOptimizationParameters = {};
        if (event.previousContainer.id === 'enabled-optimization-parameters-list') {
            const elementBeingMoved = this.enabledParameters[event.previousIndex];
            for (const enabledParameter of this.enabledParameters) {
                if (
                    enabledParameter.value > elementBeingMoved.value &&
                    enabledParameter.name !== elementBeingMoved.name
                ) {
                    enabledParameter.value--;
                }
                newOptimizationParameters[enabledParameter.name] = enabledParameter.value;
            }
            newOptimizationParameters[elementBeingMoved.name] = -1;
            for (const disabledParameter of this.enabledParameters) {
                newOptimizationParameters[disabledParameter.name] = -1;
            }
            this.updateOptimizationParameters.emit({
                preference: newOptimizationParameters as any,
            });
        }
    }

    getEnabledParameters() {
        return this.enabledParameters.sort((a, b) => {
            if (a.value > b.value) return 1;
            else return -1;
        });
    }

    constructor(private facade: RoutePlanningFacade) {}

    ngOnInit() {
        this._freeParameters = Object.assign([], this.freeParameters);
        this.facade
            .getZoneMaxDelayTime(this.planningDeliveryZone.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((maxDelayTime: number) => {
                let totalSeconds = maxDelayTime;
                this.dischargingHours = Math.floor(maxDelayTime / 3600);
                totalSeconds %= 3600;
                this.dischargingMinutes = Math.floor(totalSeconds / 60);
                this.dischargingSeconds = totalSeconds % 60;
            });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
