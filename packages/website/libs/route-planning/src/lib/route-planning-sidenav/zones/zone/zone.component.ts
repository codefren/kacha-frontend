import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    DeliveryZoneStatus,
    PlanningDeliveryZone,
    RoutePlanningFacade,
    RoutePlanningMapStage,
    RoutePlanningViewingMode,
    RouteStatus,
} from '@optimroute/state-route-planning';
import { Observable, Subject } from 'rxjs';
import { takeUntil, withLatestFrom, take } from 'rxjs/operators';
import { ToastService } from '@optimroute/shared';
import { VehiclesFacade } from '@optimroute/state-vehicles';

@Component({
    selector: 'easyroute-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ZoneComponent implements OnInit, OnDestroy, OnChanges {

    @Input()
    zone: PlanningDeliveryZone;
    @Input()
    zoneStatus: DeliveryZoneStatus;
    @Input()
    routesStatus: {
        [routeIdKey: number]: RouteStatus;
    };
    @Input()
    mapStage: RoutePlanningMapStage;
    @Input()
    highlightedRoute: number;
    @Input()
    viewingMode: RoutePlanningViewingMode;
    @Input()
    useRouteColors: boolean;

    //routePlanning$: Observable<RoutePlanningState>;
    //zoneState$: Observable<PlanningDeliveryZone>;

    connectedZones$;
    amountExpandedZones$;

    zoneOptimizationStatus$: Observable<{
        loading: boolean;
        progress: number;
        error?: string;
    }>;

    zoneInfoChips$: Observable<{
        deliveryPoints: number;
        demand: number;
        vehicles: number;
        vehiclesCapacity: number;
        vehiclesVolumen: number
    }>;
    routesInfoChips$: Observable<{
        customerWaitTime: number;
        vehicleWaitTime: number;
        // delayTime: number;
        // avgCustomerWaitTime: number;
        // avgDelayTime: number;
        travelDistance: number;
        // travelTime: number;
        time: number;
        demand: number;
        vehiclesCapacity: number;
    }>;

    routeInfoChips$: Observable<{
        customerWaitTime: number;
        vehicleWaitTime: number;
        // delayTime: number;
        // avgCustomerWaitTime: number;
        // avgDelayTime: number;
        travelDistance: number;
        deliveryPointsUnassigned: number;
        // travelTime: number;
        time: number;
        demand: number;
        vehiclesCapacity: number;
    }>;

    currentRoute = 0;
    firstActiveRouteSet: boolean = false;
    colorHovered = false;

    zoneName: string;
    zoneColor: string;
    zoneNameConfirming: boolean;


    showErrorMaxDelay: boolean = false;
    widthSidenav = 900;


    private unsubscribe$ = new Subject<void>();

    toggleSwitchViewMode(newMode: RoutePlanningViewingMode) {
        this.facade.toggleSwitchMapView(newMode);
    }

    switchRoute(increment: boolean) {
        this.currentRoute = increment ? this.currentRoute + 1 : this.currentRoute - 1;
        this.routeInfoChips$ = this.facade.getZoneRouteInfoChips(
            this.zone.id,
            this.zone.optimization.solution.routes[this.currentRoute].id,
        );
        this.facade.setZoneActiveRoute(this.zone.id, this.getCurrentRouteId());
    }
    showRouteGeometry(){
        this.facade.showRouteGeometry(this.zone.id, this.zone.optimization.solution.routes[this.currentRoute].id)
    }

    showZoneGeometry(){
        this.facade.showRouteGeometryZone(this.zone.id)
    }

    toggleDisplayZone() {
        this.facade.toggleDisplayZone(this.zone.id);
    }
    toggleSelectRoute() {
        if (this.routesStatus[this.getCurrentRouteId()].selected) {
            if (this.highlightedRoute === this.getCurrentRouteId())
                this.facade.highlightRoute(-1);
        } else {
            this.facade.highlightRoute(this.getCurrentRouteId());
            if (!this.zoneStatus.selected) this.facade.toggleSelectZone(this.zone.id);
        }
        this.facade.toggleSelectRoute(this.zone.id, this.getCurrentRouteId());
    }
    toggleDisplayRoute() {
        if (this.highlightedRoute === this.getCurrentRouteId()) {
            this.facade.highlightRoute(-1);
        } else {
            if (!this.zoneStatus.selected) this.facade.toggleSelectZone(this.zone.id);
            if (!this.routesStatus[this.getCurrentRouteId()].selected)
                this.facade.toggleSelectRoute(this.zone.id, this.getCurrentRouteId());
            this.facade.highlightRoute(this.getCurrentRouteId());
        }
        //this.facade.toggleDisplayRoute(this.zoneId, this.routes[this.currentRoute].id);
    }

    getCurrentRouteId() {
        return this.zone.optimization &&
            this.zone.optimization.solution &&
            this.zone.optimization.solution.routes &&
            this.currentRoute < this.zone.optimization.solution.routes.length &&
            this.zone.optimization.solution.routes[this.currentRoute]
            ? this.zone.optimization.solution.routes[this.currentRoute].id
            : null;
    }
    onExpandedChange(event) {
        this.facade.toggleExpandZone(this.zone.id);
        this.facade.setZoneActiveRoute(this.zone.id, -1);
    }
    onExpandedPointsChange(event) {
        this.facade.toggleExpandZonePoints(this.zone.id);
    }
    onExpandedSettingsChange(event) {
        this.facade.toggleExpandZoneSettings(this.zone.id);
    }
    onExpandedRoutesChange(event) {
        this.facade.toggleExpandZoneRoutes(this.zone.id);
    }
    onExpandedRoutesSettingsChange(event) {
        this.facade.toggleExpandZoneRoutesSettings(this.zone.id);
    }
    onHoveredChange(hover: boolean) {
        if (hover) {
            this.facade.setHoveredZone(this.zone.id);
            return;
        }
        this.facade.setHoveredZone(-1);
    }

    onRouteTitleChange() {}

    confirmName() {
        if (this.zoneName.length < 2) {
            this.toastService.displayWebsiteRelatedToast(
                'El nombre de una ruta debe tener un mínim de 2 carácteres',
            );
            this.zoneName = this.zone.name;
        } else if (this.zoneName.length > 150) {
            this.toastService.displayWebsiteRelatedToast(
                'El nombre de una ruta debe tener un máximo de 150 carácteres',
            );
            this.zoneName = this.zone.name;
        } else {
            this.updateZoneName(this.zoneName);
        }
    }
    discardName() {
        if (!this.zoneNameConfirming) this.zoneName = this.zone.name;
        this.zoneNameConfirming = false;
    }
    confirmColor() {
        this.updateZoneColor(this.zoneColor);
    }
    discardColor() {
        this.zoneColor = this.zone.color;
    }

    updateZoneName(name: string) {
        this.facade.updateZoneName(this.zone.id, name);
    }
    updateZoneColor(color: string) {
        this.facade.updateZoneColor(this.zone.id, color);
    }
    updateRouteColor(color: string) {
        this.facade.updateRouteColor(this.zone.id, this.getCurrentRouteId(), color);
    }

    onZoneNameKeyPress(event) {
        if (event.key == 'Enter') {
            this.confirmName();
            this.zoneNameConfirming = true;
            document.getElementById('zoneNameInput_' + this.zone.id).blur();
        }
    }

    isBeingEvaluated() {
        return (
            this.routesStatus[this.getCurrentRouteId()] &&
            this.routesStatus[this.getCurrentRouteId()].evaluating
        );
    }


    constructor(
        private facade: RoutePlanningFacade,
        private changeRef: ChangeDetectorRef,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.zoneInfoChips$ = this.facade.getZoneInfoChips(this.zone.id);
        this.zoneInfoChips$.subscribe((data)=>{
        })
        this.routesInfoChips$ = this.facade.getZoneRoutesInfoChips(this.zone.id);
        this.zoneOptimizationStatus$ = this.facade.getOptimizationStatus(this.zone.id);
        this.facade
            .getZoneStatusOptimized(this.zone.id)
            .pipe(
                takeUntil(this.unsubscribe$),
                withLatestFrom(this.facade.getZoneById(this.zone.id)),
            )
            .subscribe(([optimized, zone]) => {
                if (optimized) {
                    this.routeInfoChips$ = this.facade.getZoneRouteInfoChips(
                        zone.id,
                        zone.optimization.solution.routes[this.currentRoute].id,
                    );

                    this.facade.getErrorMaxDelaytime(zone.id).pipe(take(1)).subscribe((data)=>{
                        this.showErrorMaxDelay = data;
                    })
                }
            });
        this.amountExpandedZones$ = this.facade.amountExpandedZones$;
        this.amountExpandedZones$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((amountExpandedZones) => {
                this.changeRef.detectChanges();
                return amountExpandedZones;
            });
        this.zoneName = this.zone.name;
        this.zoneColor = this.zone.color;

        this.facade.closeComplete$.pipe(takeUntil(this.unsubscribe$)).subscribe((data)=>{
            if(data){
                this.widthSidenav = window.innerWidth - 65;
            } else {
                this.widthSidenav = 900;
            }
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        // NPI del que fa això
        if (!this.firstActiveRouteSet && this.zoneStatus && this.zoneStatus.optimized) {
            this.firstActiveRouteSet = true;
            this.facade.setZoneActiveRoute(this.zone.id, this.getCurrentRouteId());
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
