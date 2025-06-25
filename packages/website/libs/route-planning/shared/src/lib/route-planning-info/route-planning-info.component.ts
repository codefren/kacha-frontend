import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfacePreferences, ManagementPreferences } from '@optimroute/backend';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { take } from 'rxjs/operators';
import { AddCrossDockingComponent } from '../route-planning-options/zone-vehicles/add-cross-docking/add-cross-docking.component';

@Component({
    selector: 'easyroute-route-planning-info',
    templateUrl: './route-planning-info.component.html',
    styleUrls: ['./route-planning-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlanningInfoComponent implements OnInit {
    @Input()
    zoneInfoChips: {
        deliveryPoints: number;
        demand: number;
        vehicles: number;
        vehiclesCapacity: number;
        vehiclesVolumen: number
        isEvaluated: boolean;
        customerWaitTime: number;
        vehicleWaitTime: number;
        delayTime: number;
        travelDistance: number;
        time: number;
        crossDocking: number;
        costTotal: number;
        volumetric: number
        box: number;
    };

    @Input() alignRight: boolean = this.alignRight || false;

    @Input()
    ignoreCapacityLimit: boolean;

    @Input()
    showRouteDeliveryPointsAmount = true;

    @Input()
    routeInfoChips: {
        deliveryPoints: number;
        customerWaitTime: number;
        vehicleWaitTime: number;
        delayTime: number;
        // avgCustomerWaitTime: number;
        // avgDelayTime: number;
        travelDistance: number;
        // travelTime: number;
        volumetric: number;
        time: number;
        deliveryPointsUnassigned: number;
        demand: number;
        vehiclesCapacity,
        vehiclesVolumen,
        costTotal: number;
        box: number;
    };

    @Input()
    showRouteChips: boolean = false;

    @Input()
    showZoneChips: boolean = true;

    @Input()
    hasShadow = false;

    @Input()
    routesColor: ThemePalette | string;

    @Input()
    zonesColor: ThemePalette | string;

    @Input()
    showErrorMaxDelayTime: boolean = false;


    @Input()
    zone: any = undefined;

    managementPreferences: ManagementPreferences;

    interfacePreferences: InterfacePreferences;

    @Input()
    zoneId: number;

    //planningSession$: Observable<PlanningSession>;
    //zoneState$;

    // Call routing output service to get routing output with id = routingOutputId and zone = zone

    constructor(private facadePreferences: PreferencesFacade,
        private facade: RoutePlanningFacade,
        private dialog: NgbModal) { }

    ngOnInit() {
        this.facadePreferences.managementPreferences$.pipe(take(1)).subscribe((data) => {
            this.managementPreferences = data;
        });

        this.facadePreferences.interfacePreferences$.pipe(take(1)).subscribe((data) => {
            this.interfacePreferences = data;
        });

        console.log(this.zone);
    }

    convertToDecimal(number: number) {
        return number.toFixed(2);
    }

    removeCrossDocking() {
        this.facade.addCrossDocking(0, this.zoneId, this.zoneInfoChips.isEvaluated);
    }

    editCrossDocking() {
        const dialogRef = this.dialog.open(AddCrossDockingComponent, {
            size: 'xs',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.componentInstance.crossdocking = this.zoneInfoChips.crossDocking;


        dialogRef.result.then((result) => {
            console.log(result);
            if (result[0]) {
                this.facade.addCrossDocking(result[1], this.zoneId, this.zoneInfoChips.isEvaluated);
            }
        })
    }


    calculateWeightPercent(disponible, ocupado){

        if(+disponible === 0){
            return 0;
        } else {
            return (ocupado * 100 / disponible).toFixed(1);
        }
    }
    formatEuro(quantity) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(quantity);

    }

    addNomenclatuta(value: any) {
        return (+value ).toFixed(2)+ ' m³'
    }
}



