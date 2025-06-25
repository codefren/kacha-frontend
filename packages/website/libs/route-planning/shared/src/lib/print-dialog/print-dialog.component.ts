import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Route, RoutePlanningFacade } from '@optimroute/state-route-planning';
import jsPDF from 'jspdf';
import {
    PrintingRoute,
    PrintingRoutePoint,
} from 'libs/shared/src/lib/components/route-print-template/route-print-template.component';
import { Subject } from 'rxjs';
import { secondsToDayTimeAsString } from '@optimroute/shared';
import { secondsToAbsoluteTime } from 'libs/shared/src/lib/util-functions/time-format';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryZones } from '@optimroute/state-delivery-zones';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { take } from 'rxjs/operators';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import * as _ from 'lodash';

@Component({
    selector: 'easyroute-print-dialog',
    templateUrl: './print-dialog.component.html',
    styleUrls: ['./print-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintDialogComponent implements OnInit {
    data: any;
    @Input()
    routes: {
        [zoneId: number]: {
            name: string;
            routes: { [routeId: number]: Route };
        };
    };

    evaluates: DeliveryZones[];

    selectedRoutes: { [routeId: number]: boolean } = {};


    selectedEvaluates: { [zoneId: string]: boolean } = {}

    selectedAmount = 0;

    preferences: any;

    preparedRoutes: PrintingRoute[];
    sumupData = {
        totalDeliveryPoints: 0,
        totalPayload: 0,
        totalDistance: 0,
        totalTime: 0,
        travelTime: 0,
        vehicleWaitTime: 0,
        avgDelayTime: -1,
        avgWaitTime: -1,
    };
    typeRoute: string = 'isRoute';
    typeVersion: string = 'isExtensive';
    pdfUrl: string;
    getPdfUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    }
    doc: jsPDF;

    unsubscribe$ = new Subject<void>();

    download() {
        this.doc.save('polpoo_' + new Date().toLocaleDateString() + '.pdf');
    }

    prepareRoutesData() {
        this.preparedRoutes = [];
        this.sumupData = {
            totalDeliveryPoints: 0,
            totalPayload: 0,
            totalDistance: 0,
            totalTime: 0,
            travelTime: 0,
            vehicleWaitTime: 0,
            avgDelayTime: -1,
            avgWaitTime: -1,
        };
        for (let zoneId of Object.keys(this.routes)) {

            for (let route of <Route[]>(
                Array.from(Object.values(this.routes[zoneId].routes))
            )) {
                if (this.selectedRoutes[route.id]) {

                    let totalPayload = 0;
                    const points: PrintingRoutePoint[] = route.deliveryPoints.map(dp => {
                        totalPayload += this.preferences.activateCubicMeterConverter && this.preferences.cubicMeterConverter > 0 ? +(dp.demand / this.preferences.cubicMeterConverter).toFixed(2) : dp.demand;
                        return {
                            zone: this.routes[zoneId].name,
                            clientName: dp.name,
                            clientId: dp.identifier,
                            order: dp.order,
                            openTime: dp.deliveryWindow.start,
                            closeTime: dp.deliveryWindow.end,
                            deliveryExpectedTime: dp.arrivalDayTime,
                            payload: this.preferences.activateCubicMeterConverter && this.preferences.cubicMeterConverter > 0 ? +(dp.demand / this.preferences.cubicMeterConverter).toFixed(2) : dp.demand,
                            driverName: route.vehicle.user.name + ' ' + route.vehicle.user.surname
                        };
                    });
                    this.sumupData.totalDeliveryPoints += points.length;
                    this.sumupData.totalPayload += totalPayload;
                    this.sumupData.totalDistance += route.travelDistance;
                    this.sumupData.totalTime += route.time;
                    this.sumupData.travelTime += route.travelTime;
                    this.sumupData.vehicleWaitTime += route.vehicleWaitTime;
                    this.sumupData.avgDelayTime =
                        this.sumupData.avgDelayTime != -1
                            ? (this.sumupData.avgDelayTime + route.avgDelayTime) / 2.0
                            : route.avgDelayTime;
                    if (this.sumupData.avgWaitTime != -1)
                        this.sumupData.avgWaitTime =
                            (this.sumupData.avgWaitTime + route.avgCustomerWaitTime) / 2.0;
                    else this.sumupData.avgWaitTime = route.avgCustomerWaitTime;
                    /*this.sumupData.avgWaitTime !== -1
                        ? (this.sumupData.avgWaitTime + route.avgCustomerWaitTime) / 2.0
                        : route.avgCustomerWaitTime;*/
                    this.preparedRoutes.push({
                        info: {
                            vehicle: route.vehicle.name,
                            zone: this.routes[zoneId].name,
                            deliveryPoints: route.deliveryPoints.length.toString(),
                            totalPayload: totalPayload + ' unidades',
                            travelDistance:
                                parseFloat((+route.travelDistance / 1000).toFixed(2)) +
                                ' km',
                            totalTime: secondsToAbsoluteTime(route.time),
                            travelTime: secondsToAbsoluteTime(route.travelTime),
                            vehicleWaitTime: secondsToAbsoluteTime(route.vehicleWaitTime),
                            avgDelayTime: secondsToAbsoluteTime(route.avgDelayTime),
                            avgWaitTime: secondsToAbsoluteTime(route.avgCustomerWaitTime),
                            routeStartTime: secondsToDayTimeAsString(
                                route.departureDayTime,
                            ),
                            routeEndTime: secondsToDayTimeAsString(
                                route.depotArrivalDayTime,
                            ),
                        },
                        routePoints: points,
                    });
                }
            }
        }
    }

    closeDialog() {
        this.activeModal.close();
    }

    constructor(
        private routePlanningFacade: RoutePlanningFacade,
        // public dialogRef: MatDialogRef<PrintDialogComponent>,
        // @Inject(MAT_DIALOG_DATA) public data,
        private changeRef: ChangeDetectorRef,
        public activeModal: NgbActiveModal,
        private sanitizer: DomSanitizer,
        private preferencesFacade: PreferencesFacade,
        private vehicleFacade: VehiclesFacade
    ) {
        this.sanitizer = sanitizer;
    }

    ngOnInit() {

        this.typeRoute = 'isRoute';
        this.typeVersion = 'isExtensive';
        this.routes = _.cloneDeep(this.data.routes);

        this.vehicleFacade.allVehicles$.pipe(take(1)).subscribe((vehicles) => {
            Object.values(this.routes).forEach(zone => {
                Object.values(zone.routes).forEach(route => {

                    const vehicle = vehicles.find(x => x.id == route.vehicle.vehicleId);

                    if (vehicle) {
                        route.vehicle = {
                            ...route.vehicle,
                            user: {
                                ...vehicle.user
                            }
                        }
                    }

                    this.selectedRoutes[route.id] = true;
                    ++this.selectedAmount;
                });
            });
        })

        this.evaluates = Object.values(this.data.evalutes);
        for (let zoneId of Object.keys(this.evaluates)) {
            this.selectedEvaluates[zoneId] = true;
        }
        this.preferencesFacade.managementPreferences$.pipe(take(1)).subscribe((data) => {
            this.preferences = data;
            this.prepareRoutesData();
        })

    }

    areRoutesEmpty() {
        return Object.keys(this.routes).length === 0;
    }

    areEvaluatesEmpty() {
        return Object.keys(this.evaluates).length === 0;
    }

    isAllZoneChecked(zoneId: string) {
        if (this.typeRoute === 'isRoute') {
            for (let routeId in this.routes[zoneId].routes) {
                if (!this.selectedRoutes[routeId]) return false;
            }
            return true;
        } else {
            if (!this.selectedEvaluates[zoneId]) return false;
            return true;
        }

    }

    checkAllZone(zoneId: string, value: boolean) {
        if (this.typeRoute === 'isRoute') {
            for (let routeId in this.routes[zoneId].routes) {
                this.toogleSelect(routeId, value, false);
            }
            this.prepareRoutesData();
        } else {
            /* if (!value) {
                this.disabledAmount -= 1;
            } else this.disabledAmount += 1; */

            this.preparedRoutes = [];
            this.sumupData = {
                avgDelayTime: 0,
                avgWaitTime: 0,
                totalDeliveryPoints: 0,
                totalDistance: 0,
                totalPayload: 0,
                totalTime: 0,
                travelTime: 0,
                vehicleWaitTime: 0
            };
            this.selectedEvaluates[zoneId] = value;
            this.prepareEvaluateData();
        }

    }

    isAllsZoneChecked() {
        if (this.typeRoute === 'isRoute') {
            for (let zoneId of Object.keys(this.selectedRoutes)) {
                if (!this.selectedRoutes[zoneId]) return false;
            }
            return true;
        } else {
            for (let zoneId of Object.keys(this.selectedEvaluates)) {
                if (!this.selectedEvaluates[zoneId]) return false;
            }
            return true;
        }

    }

    checkAllRoutes(value) {
        if (this.typeRoute === 'isRoute') {
            if (!value) {
                for (let zoneId of Object.keys(this.selectedRoutes)) {
                    this.selectedRoutes[zoneId] = false;
                }
            } else {
                for (let zoneId of Object.keys(this.selectedRoutes)) {
                    this.selectedRoutes[zoneId] = true;
                }
            }
            this.prepareRoutesData();
        } else {
            this.preparedRoutes = [];
            this.sumupData = {
                avgDelayTime: 0,
                avgWaitTime: 0,
                totalDeliveryPoints: 0,
                totalDistance: 0,
                totalPayload: 0,
                totalTime: 0,
                travelTime: 0,
                vehicleWaitTime: 0
            };
            for (let zoneId of Object.keys(this.selectedEvaluates)) {
                this.selectedEvaluates[zoneId] = value;
            }
            this.prepareEvaluateData();
        }

    }

    toogleSelect(routeId: string, value: boolean, recalculate: boolean) {
        if (!value) {
            this.selectedAmount -= 1;
        } else this.selectedAmount += 1;
        this.selectedRoutes[routeId] = value;
        if (recalculate) this.prepareRoutesData();
    }

    getRouteName(name: string) {
        let newName = name.split('-');
        return newName[newName.length - 1];
    }

    onPdfChange({ url, doc }) {
        this.pdfUrl = url;
        this.doc = doc;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    changeRadioType(value) {
        this.preparedRoutes = [];
        this.sumupData = {
            avgDelayTime: 0,
            avgWaitTime: 0,
            totalDeliveryPoints: 0,
            totalDistance: 0,
            totalPayload: 0,
            totalTime: 0,
            travelTime: 0,
            vehicleWaitTime: 0
        };

        if (this.typeRoute === 'isRoute') {
            this.prepareRoutesData();
        } else {
            this.prepareEvaluateData();
        }
    }


    prepareEvaluateData() {
        this.preparedRoutes = [];
        for (let zoneId of Object.keys(this.evaluates)) {
            if (this.selectedEvaluates[zoneId]) {
                const zone = this.evaluates[zoneId];

                let totalPayload = 0;
                const points: PrintingRoutePoint[] = zone.deliveryPoints.map(dp => {
                    
                    totalPayload += dp.demand;
                    return {
                        zone: zone.name,
                        clientName: dp.name,
                        clientId: dp.identifier,
                        order: dp.order,
                        openTime: dp.deliveryWindow.start,
                        closeTime: dp.deliveryWindow.end,
                        deliveryExpectedTime: dp.arrivalDayTime,
                        payload: dp.demand,
                        driverName: (zone.vehicles.length > 0) ? zone.vehicles[0].user.name + ' ' + zone.vehicles[0].user.surname : 'undefined',
                    };
                });
                this.sumupData.totalDeliveryPoints += points.length;
                this.sumupData.totalPayload += totalPayload;
                this.sumupData.totalDistance += zone.travelDistance;
                this.sumupData.totalTime += zone.time;
                this.sumupData.travelTime += zone.travelTime;
                this.sumupData.vehicleWaitTime += zone.vehicleWaitTime;
                this.sumupData.avgDelayTime =
                    this.sumupData.avgDelayTime != -1
                        ? (this.sumupData.avgDelayTime + zone.avgDelayTime) / 2.0
                        : zone.avgDelayTime;
                if (this.sumupData.avgWaitTime != -1)
                    this.sumupData.avgWaitTime =
                        (this.sumupData.avgWaitTime + zone.avgCustomerWaitTime) / 2.0;
                else this.sumupData.avgWaitTime = zone.avgCustomerWaitTime;
                this.preparedRoutes.push({
                    info: {
                        vehicle: zone.vehicles[0] ? zone.vehicles[0].name : 'undefined',
                        zone: zone.name,
                        deliveryPoints: zone.deliveryPoints.length.toString(),
                        totalPayload: totalPayload + ' unidades',
                        travelDistance:
                            parseFloat((+zone.travelDistance / 1000).toFixed(2)) +
                            ' km',
                        totalTime: secondsToAbsoluteTime(zone.time),
                        travelTime: secondsToAbsoluteTime(zone.travelTime),
                        vehicleWaitTime: secondsToAbsoluteTime(zone.vehicleWaitTime),
                        avgDelayTime: secondsToAbsoluteTime(zone.avgDelayTime),
                        avgWaitTime: secondsToAbsoluteTime(zone.avgCustomerWaitTime),
                        routeStartTime: secondsToDayTimeAsString(
                            zone.departureDayTime,
                        ),
                        routeEndTime: secondsToDayTimeAsString(
                            zone.depotArrivalDayTime,
                        ),
                    },
                    routePoints: points,
                });
            }
        }
    }
}
