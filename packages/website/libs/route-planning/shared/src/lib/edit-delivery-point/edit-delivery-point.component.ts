import {
    Component,
    OnInit,
    Input,
    Inject,
    OnDestroy,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Time } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
    RoutePlanningFacade,
    RoutePlanningDeliveryPoint,
    PlanningDeliveryZone,
    Route,
} from '@optimroute/state-route-planning';
import { map, takeUntil, take, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import {
    dayTimeAsStringToSeconds,
    secondsToDayTimeAsString,
    dayTimeAsTimeToSeconds,
    ToastService,
} from '@optimroute/shared';

@Component({
    selector: 'easyroute-edit-delivery-point',
    templateUrl: './edit-delivery-point.component.html',
    styleUrls: ['./edit-delivery-point.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDeliveryPointComponent implements OnInit, OnDestroy {
    @Input() zoneId;
    @Input() deliveryPointId;

    deliveryPoint$: Observable<RoutePlanningDeliveryPoint>;
    zones: {
        [zoneId: number]: {
            id: number;
            name: string;
            amountDeliveryPoints: number;
            routes: {
                [routeId: number]: {
                    route: Route;
                    id: number;
                    amountDeliveryPoints: number;
                };
            };
        };
    };

    isOpeningTimeNotFree = true;
    _isOpeningTimeNotFree = true;

    isClosingTimeNotFree = true;
    _isClosingTimeNotFree = true;

    selectedZoneId: number;
    _selectedZoneId: number;

    selectedRouteId: number;
    _selectedRouteId: number;

    order: number;
    _order: number;

    openingTime: string;
    _openingTime: string;
    closingTime: string;
    _closingTime: string;

    mode: 'route' | 'zone' = 'zone';

    closeDialog() {
        this.dialogRef.close();
    }

    accept() {
        if (this.mode === 'zone') {
            const updateDeliveryWindowSuccessful = this.updateDeliveryWindow();
            const updatePlacementSuccessful = this.updatePlacementZone();
            if (updateDeliveryWindowSuccessful && updatePlacementSuccessful) {
                this.closeDialog();
            }
        } else {
            const updatePlacementSuccessful = this.updatePlacementRoute();
            const updateDeliveryWindowSuccessful = this.updateDeliveryWindow();
            if (updateDeliveryWindowSuccessful && updatePlacementSuccessful) {
                this.closeDialog();
            }
        }
    }

    updatePlacementZone(): boolean {
        if (this.selectedZoneId !== this._selectedZoneId || this.order !== this._order) {
            const newOrder = Math.max(
                1,
                Math.min(
                    this._order,
                    this._selectedZoneId === this.zoneId
                        ? this.zones[this._selectedZoneId].amountDeliveryPoints
                        : this.zones[this._selectedZoneId].amountDeliveryPoints + 1,
                ),
            );
            console.log(this.zones[this._selectedZoneId]);
            this.facade.deliveryPointZoneMovement(
                this.deliveryPointId,
                this.zoneId,
                this._selectedZoneId,
                this.order,
                newOrder,
            );
        }
        return true;
    }

    updatePlacementRoute(): boolean {
        if (this.selectedRouteId !== this._selectedRouteId || this.order !== this._order) {
            const newOrder = Math.max(
                1,
                Math.min(
                    this._order,
                    this._selectedRouteId === this.data.routeId
                        ? this.zones[this._selectedZoneId].routes[this._selectedRouteId]
                              .amountDeliveryPoints
                        : this.zones[this._selectedZoneId].routes[this._selectedRouteId]
                              .amountDeliveryPoints + 1,
                ),
            );
            //console.log(
            //     this.deliveryPointId,
            //     this.selectedZoneId,
            //     this._selectedZoneId,
            //     this.selectedRouteId,
            //     this._selectedRouteId,
            //     this.order,
            //     newOrder,
            // );
            this.facade.deliveryPointRouteMovement(
                this.deliveryPointId,
                this.selectedZoneId,
                this._selectedZoneId,
                this.selectedRouteId,
                this._selectedRouteId,
                this.order,
                newOrder,
            );
        }
        return true;
    }

    updateDeliveryWindow(): boolean {
        const start = dayTimeAsStringToSeconds(this._openingTime);
        const end = dayTimeAsStringToSeconds(this._closingTime);
        if (!this._isClosingTimeNotFree || !this._isOpeningTimeNotFree || start < end) {
            let timeWindow: Partial<RoutePlanningDeliveryPoint['deliveryWindow']> = {};
            if (
                this.isOpeningTimeNotFree !== this._isOpeningTimeNotFree ||
                (this._isOpeningTimeNotFree && this._openingTime !== this.openingTime)
            ) {
                timeWindow['start'] = this._isOpeningTimeNotFree ? start : null;
            }
            if (
                this.isClosingTimeNotFree !== this._isClosingTimeNotFree ||
                (this._isClosingTimeNotFree && this._closingTime !== this.closingTime)
            ) {
                timeWindow['end'] = this._isClosingTimeNotFree ? end : null;
            }
            if (Object.keys(timeWindow).length !== 0) {
                /* this.data.routeId
                    ? this.facade.updateRouteDeliveryPointTimeWindow(
                          this.zoneId,
                          this.data.routeId,
                          this.deliveryPointId,
                          timeWindow,
                      )
                    : this.facade.updateDeliveryPointTimeWindow(
                          this.zoneId,
                          this.deliveryPointId,
                          timeWindow,
                      ); */
            }
            return true;
        } else {
            this.openNotValidSnackbar();
            this.openingTime = this._openingTime;
            this.closingTime = this._closingTime;
            return false;
        }
    }

    zoneChanged() {
        if (this.mode === 'route') {
            this._selectedRouteId = +Object.keys(
                this.zones[this._selectedZoneId].routes,
            )[0];
        }
        this._order = Math.max(
            1,
            Math.min(this._order, this.zones[this.selectedZoneId].amountDeliveryPoints),
        );
    }

    openNotValidSnackbar() {
        this.toastService.displayWebsiteRelatedToast(
            'Los valores para la ventana de entrega no son válidos',
            this._translate.instant('GENERAL.ACCEPT')
        );
    }

    routesPickFunction(routes) {
        const object: any = {};
        for (const index in routes) {
            object[routes[index].id] = {
                // id: routeId,
                route: routes[index],
                id: routes[index].id,
                amountDeliveryPoints: routes[index].deliveryPoints.length,
            };
        }
        return object;
    }
    zonesPickFunction(zones) {
        const object: any = {};
        for (const zoneId in zones) {
            if (
                this.mode === 'route' &&
                zones[zoneId] &&
                zones[zoneId].optimization &&
                zones[zoneId].optimization.solution
            )
                object[zoneId] = {
                    // id: zoneId,
                    id: zones[zoneId].id,
                    name: zones[zoneId].name,
                    amountDeliveryPoints: zones[zoneId].deliveryPoints.length,
                    routes:
                        zones[zoneId] &&
                        zones[zoneId].optimization &&
                        zones[zoneId].optimization.solution &&
                        zones[zoneId].optimization.solution.routes
                            ? this.routesPickFunction(
                                  zones[zoneId].optimization.solution.routes,
                              )
                            : {},
                };
            else if (this.mode === 'zone')
                object[zoneId] = {
                    // id: zoneId,
                    id: zones[zoneId].id,
                    name: zones[zoneId].name,
                    amountDeliveryPoints: zones[zoneId].deliveryPoints.length,
                    routes: {},
                };
        }
        return object;
    }
    retrieveZones() {
        this.facade.planningSession$.pipe(take(1)).subscribe(planningSession => {
            this.zones = this.zonesPickFunction(planningSession.deliveryZones);
        });
    }

    retrieveDeliveryPointInZoneInfo() {
        this.deliveryPoint$ = this.facade.getZoneById(this.zoneId).pipe(
            take(1),
            map(item => item.deliveryPoints.find(x => x.id === this.deliveryPointId)),
        );
        this.deliveryPoint$
            .pipe(
                take(1),
                map(x => {
                    if (x && x.deliveryWindow) {
                        return x.deliveryWindow;
                    } else {
                        return null;
                    }
                }),
            )
            .subscribe(dw => {
                //console.log('edit delivery Point');
                if (dw && dw.start) {
                    this.isOpeningTimeNotFree = true;
                    this.openingTime = secondsToDayTimeAsString(dw.start);
                } else {
                    this.isOpeningTimeNotFree = false;
                    this.openingTime = '00:00';
                }
                if (dw && dw.end) {
                    this.isClosingTimeNotFree = true;
                    this.closingTime = secondsToDayTimeAsString(dw.end);
                } else {
                    this.isClosingTimeNotFree = false;
                    this.closingTime = '23:59';
                }
                this._isOpeningTimeNotFree = this.isOpeningTimeNotFree;
                this._isClosingTimeNotFree = this.isClosingTimeNotFree;
                this._openingTime = this.openingTime;
                this._closingTime = this.closingTime;
            });
    }

    retrieveDeliveryPointInRouteInfo() {
        this.deliveryPoint$ = this.facade.getZoneById(this.zoneId).pipe(
            take(1),
            map(zone => zone.optimization.solution.routes),
            map(routes => routes.find(route => route.id === this.data.routeId)),
            map(route =>
                route.deliveryPoints.find(dp => dp.id === this.data.deliveryPointId),
            ),
        );
        this.deliveryPoint$
            .pipe(
                take(1),
                map(x => {
                    if (x && x.deliveryWindow) {
                        return x.deliveryWindow;
                    } else {
                        return null;
                    }
                }),
            )
            .subscribe(dw => {
                //console.log('edit delivery Point, retrieve route tw');
                if (dw && dw.start) {
                    this.isOpeningTimeNotFree = true;
                    this.openingTime = secondsToDayTimeAsString(dw.start);
                } else {
                    this.isOpeningTimeNotFree = false;
                    this.openingTime = '00:00';
                }
                if (dw && dw.end) {
                    this.isClosingTimeNotFree = true;
                    this.closingTime = secondsToDayTimeAsString(dw.end);
                } else {
                    this.isClosingTimeNotFree = false;
                    this.closingTime = '23:59';
                }
                this._isOpeningTimeNotFree = this.isOpeningTimeNotFree;
                this._isClosingTimeNotFree = this.isClosingTimeNotFree;
                this._openingTime = this.openingTime;
                this._closingTime = this.closingTime;
            });
    }

    constructor(
        public facade: RoutePlanningFacade,
        public dialogRef: MatDialogRef<EditDeliveryPointComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        public toastService: ToastService,
        private _translate: TranslateService
    ) {}

    ngOnInit() {
        this.zoneId = this.data.zoneId;
        this.selectedZoneId = this.zoneId;
        this._selectedZoneId = this.zoneId;
        //console.log(this.selectedZoneId);
        this.order = this.data.order;
        this._order = this.data.order;
        this.deliveryPointId = this.data.deliveryPointId;

        if (this.data.routeId) {
            this.mode = 'route';
            this.selectedRouteId = this.data.routeId;
            this._selectedRouteId = this.data.routeId;
        }

        this.retrieveZones();
        //console.log(this.zones);

        if (this.mode === 'zone') {
            this.retrieveDeliveryPointInZoneInfo();
        } else {
            this.retrieveDeliveryPointInRouteInfo();
        }
    }

    ngOnDestroy() {}
}
