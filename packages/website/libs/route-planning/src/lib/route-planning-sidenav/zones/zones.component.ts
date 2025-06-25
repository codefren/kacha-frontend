import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { BackendService, Vehicle } from '@optimroute/backend';
import {
    PlanningSession,
    RoutePlanningFacade,
    RoutePlanningState,
    RoutePlanningMapStage,
    DeliveryZoneStatus,
    PlanningDeliveryZone,
    RoutePlanningViewingMode,
} from '@optimroute/state-route-planning';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { takeUntil, pairwise, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateZoneModalComponent } from '../create-zone-modal/create-zone-modal.component';
import { KeyValuePipe } from '@angular/common';
import { ResumeRouteModalComponent } from 'libs/route-planning/shared/src/lib/resume-route-modal/resume-route-modal.component';
import { ModalDeliveryPointPendingComponent } from '../../route-planning-toolbar/modal-delivery-point-pending/modal-delivery-point-pending.component';
import { RoutePlanningService } from '../../route-planning.service';
import { LoadingService } from '@optimroute/shared';
import { ModalPointPendingComponent } from '../../route-planning-toolbar/modal-point-pending/modal-point-pending.component';
import { PreferencesFacade } from '@optimroute/state-preferences';

@Component({
    selector: 'easyroute-zones',
    templateUrl: './zones.component.html',
    styleUrls: ['./zones.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZonesComponent implements OnInit, OnDestroy {
    @Input()
    routePlanning: RoutePlanningState;

    mapStage$: Observable<RoutePlanningMapStage>;

    sidenavOpened$: Observable<boolean>;

    unsubscribe$ = new Subject<void>();

    deliveryPointPendingCount$: Observable<number>;
    deliveryPendingAll$: Observable<number>;
    zonesStatus$: Observable<{ [zoneId: number]: DeliveryZoneStatus }>;
    routesStatus$: Observable<{
        [zoneId: number]: { [routeId: number]: { selected: boolean; displayed: boolean } };
    }>;


    deliveryPendingCounts: number;

    countZones$: Observable<{
        countZones: number,
        countZonesOptimized: number
    }>
    constructor(
        private routePlanningFacade: RoutePlanningFacade,
        private vehiclesFacade: VehiclesFacade,
        private _modalService: NgbModal,
        public pipeKeyValue: KeyValuePipe,
        private dialog: NgbModal,
        private backend: BackendService,
        private service: RoutePlanningService,
        private loadingService: LoadingService,
        private preferencesFacade: PreferencesFacade
    ) { }

    trackByFn(index, item) {
        return item.id;
    }

    onSelectAllChange($event, viewingMode: RoutePlanningViewingMode) {
        if (viewingMode == RoutePlanningViewingMode.zones) {
            if ($event.checked) this.routePlanningFacade.selectAll();
            else this.routePlanningFacade.deselectAll();
        } else {
            if ($event.checked) this.routePlanningFacade.selectAllRoutes();
            else this.routePlanningFacade.deselectAllRoutes();
        }
    }

    async joinZones() {
        let zonesJoin: number[] = [];
        let vehicles: any[] = [];
        const preferences = await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise();
        const zones = await this.routePlanningFacade.allZones$.pipe(take(1)).toPromise();
        this.routePlanningFacade.allZonesStatus$.pipe(take(1))
            .subscribe((data) => {
                for (let zoneId in data) {
                    if (data[zoneId].selected) zonesJoin.push(+zoneId);
                }
                if (zonesJoin.length > 0) {
                    zonesJoin.forEach(zoneId => {
                        zones[+zoneId].vehicles.forEach((vehicle) => {
                            vehicles.push(vehicle);
                        });
                    });
                    this.routePlanningFacade.joinZones(null, vehicles, null, null, preferences.createSession.autoEvaluateOnCharge);
                }
            })

    }

    organizeByService() {
    }

    async resumeRoute() {
        const modal = await this._modalService.open(ResumeRouteModalComponent, {

            backdrop: 'static',

            centered: true,

            size: 'md',

            windowClass: 'resume-route-modal'

        });

    }

    allSelected(
        zonesStatus: { [key: number]: DeliveryZoneStatus },
        routesStatus: {
            [key: number]: { [key: number]: { selected: boolean; displayed: boolean } };
        },
        viewingMode: RoutePlanningViewingMode,
    ) {
        if (viewingMode === RoutePlanningViewingMode.zones) {
            for (let zoneId in zonesStatus) {
                if (!zonesStatus[zoneId].selected) return false;
            }
            return true;
        }
        for (const zoneId in routesStatus) {
            if (zonesStatus[zoneId] && zonesStatus[zoneId].optimized) {
                if (!zonesStatus[zoneId].selected) return false;
                for (const routeId in routesStatus[zoneId]) {
                    if (!routesStatus[zoneId][routeId].selected) return false;
                }
            }
        }
        return true;
    }


    haveNotAssigned(zoneIds: number[]) {
        let have: boolean = false;
        zoneIds.forEach(zoneId => {
            this.routePlanning.planningSession.deliveryZones[zoneId].optimization.solution.routes.forEach(route => {
                if (route.deliveryPointsUnassigned && route.deliveryPointsUnassigned.length > 0) {
                    have = true;
                }
            })
        });

        return have;
    }

    createZone() {
        const modal = this._modalService.open(CreateZoneModalComponent, {

            backdrop: 'static',

            backdropClass: 'customBackdrop',

            centered: true,

            size: 'lg'

        });
        const zones: any = this.pipeKeyValue.transform(this.routePlanning.planningSession.deliveryZones);
        modal.componentInstance.sessionId = zones[0].value.sessionId;
        modal.result.then((data) => {
            if (data) {
                //this.zonePolygon = data;
            }
        }, (error) => {
        });
    }
    ngOnInit() {
        this.countZones$ = this.routePlanningFacade.getZonesOptimizedCount$;
        this.mapStage$ = this.routePlanningFacade.mapStage$;
        this.sidenavOpened$ = this.routePlanningFacade.sideNavState$;
        this.zonesStatus$ = this.routePlanningFacade.allZonesStatus$;
        this.routesStatus$ = this.routePlanningFacade.allRoutesStatus$;
        this.deliveryPointPendingCount$ = this.routePlanningFacade.deliveryPointPending$;
        this.deliveryPendingAll$ = this.routePlanningFacade.deliveryPendingAll$;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public switchView(newView: RoutePlanningViewingMode) {
        this.routePlanningFacade.toggleSwitchMapView(newView);
    }

    get orderedZones() {
        let data = this.routePlanning && this.routePlanning.planningSession
            ? Object.values(this.routePlanning.planningSession.deliveryZones)
                .reduce<PlanningDeliveryZone[]>((result, currentZone) => {
                    return currentZone.isMultiZone ? [...result, currentZone] : result;
                }, [])
                .concat(
                    Object.values(
                        this.routePlanning.planningSession.deliveryZones,
                    ).filter(zone => !zone.isMultiZone),
                )
                .sort(this.sortNumber)
            : [];
        return data;
    }
    sortNumber(a, b) {
        return a.name - b.name;
    }

    public showDeliveryPointPending() {

        const zones = this.pipeKeyValue.transform(this.routePlanning.planningSession.deliveryZones);
        const notAssigned = [];
        zones.forEach((element) => {

            if (this.routePlanning.deliveryZonesStatus[element.key].optimized) {
                this.routePlanning.planningSession.deliveryZones[element.key].optimization.solution.routes.forEach(route => {
                    if (route.deliveryPointsUnassigned && route.deliveryPointsUnassigned.length > 0) {
                        route.deliveryPointsUnassigned.forEach((unassigned: any) => {
                            const id = this.routePlanning.planningSession.deliveryZones[element.key].deliveryPoints.find(x => x.identifier === unassigned.identifier).id;
                            notAssigned.push({
                                id: unassigned.deliveryPointId,
                                routePlanningDeliveryPointId: id,
                                name: unassigned.name,
                                nif: unassigned.nif,
                                address: unassigned.address,
                                deliveryZoneId: unassigned.identifier,
                                demand: unassigned.demand,
                                serviceTime: unassigned.serviceTime,
                                coordinatesLatitude: unassigned.coordinates.latitude,
                                coordinatesLongitude: unassigned.coordinates.longitude,
                                deliveryWindowStart: unassigned.deliveryWindow.start,
                                deliveryWindowEnd: unassigned.deliveryWindow.end,
                                zone: this.routePlanning.planningSession.deliveryZones[element.key].identifier,
                                routeId: unassigned.routeId
                            });
                        });
                    }
                })
            }

        });


        const dialogRef = this.dialog.open(ModalPointPendingComponent, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });

        dialogRef.componentInstance.notAssigned = notAssigned;
        dialogRef.componentInstance.showOnly = true;
    }

    addDeliveryPointPending(deliveryPointsPending: number[]) {
        let sessionId = this.routePlanning.planningSession.id;
        this.backend.post('route_planning/session/add_delivery_points_pending', {
            sessionId,
            deliveryPointsPending
        }).pipe(take(1)).subscribe((response) => {
            this.recoverWithoutSaved({ id: sessionId });
        })
    }

    async recoverWithoutSaved(session: any) {
        this.routePlanningFacade.logout();
        this.loadingService.showLoading();
        this.service.recoverSessionById(session.id).pipe(take(1)).subscribe((data) => {
            this.routePlanningFacade.recoverSession(data)

            this.routePlanningFacade.isPlanningSessionLoaded$.pipe(take(1)).subscribe((data) => {
                if (data) {
                    this.service.recoverRoutePlanningSession(session.id).pipe(take(1)).subscribe((data) => {
                        if (data.length === 0) {
                            this.loadingService.hideLoading();
                            return;

                        }
                        data.zones.forEach((zone: any, index) => {
                            this.routePlanningFacade.optimizationSuccess(zone.zoneId, zone);
                            if (index + 1 === data.zones.length) {
                                this.loadingService.hideLoading();
                            }
                        });
                    });

                    this.routePlanningFacade.getDeliveryPointPending();
                }

            });
        });


    }
}
