import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
    ChangeDetectorRef, HostListener, SimpleChanges, OnChanges
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent, LoadingService } from '@optimroute/shared';
import { DeliveryZoneStatus, PlanningDeliveryZone, Route, RoutePlanningFacade, RoutePlanningState, RouteStatus } from '@optimroute/state-route-planning';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, take, takeUntil, timeout } from 'rxjs/operators';
import { ModalDeliveryPointsComponent } from '../modal-delivery-points/modal-delivery-points.component';
import { MoveMultipleDeliveryPointOptimizedComponent } from '../move-multiple-delivery-point-optimized/move-multiple-delivery-point-optimized.component';
import { MoveMultipleDeliveryPointComponent } from '../move-multiple-delivery-point/move-multiple-delivery-point.component';
import { RoutePlanningTableComponent } from '../route-planning-table/route-planning-table.component';
declare var $;
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'easyroute-route-planning-panel',
    templateUrl: './route-planning-panel.component.html',
    styleUrls: ['./route-planning-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RoutePlanningPanelComponent implements OnInit, OnChanges {
    disabled = false;
    @Input()
    hasOptimization = false;

    @Input()
    atRouteStage: boolean;

    @Input()
    isExpanded: boolean = false;
    @Input()
    isRoutesExpanded: boolean;
    @Input()
    isRoutesSettingsExpanded: boolean;
    @Input()
    isSettingsExpanded: boolean;
    @Input()
    isPointsExpanded: boolean;

    @Input()
    isRoutesDisabled: boolean;
    @Input()
    isRoutesSettingsDisabled: boolean;
    @Input()
    isSettingsDisabled: boolean;
    @Input()
    isPointsDisabled: boolean;
    @Input()
    zone: PlanningDeliveryZone;
    @Input()
    sidenavWidth: number;

    @Input()
    routeId: number = null;
    @Input()
    routeName: string;

    @Input()
    editableHeader: boolean = false;

    @Input()
    useRouteColors: boolean;

    @Input()
    zoneStatus: DeliveryZoneStatus;
    @Input()
    routesStatus: {
        [routeIdKey: number]: RouteStatus;
    };

    @Input()
    highlightedRoute: number;

    zoneOptimizationStatus$: Observable<{
        loading: boolean;
        progress: number;
        error?: string;
    }>;

    routePlanning$: Observable<RoutePlanningState>;

    get currentRouteColor(): string {
        return this.hasOptimization && this.atRouteStage && this.routeId
            ? this.zone.optimization.solution.routes.find(
                  route => route.id === this.routeId,
              ).color
            : '#000000';
    }

    @Output()
    hoverEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    expandEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    expandPointsEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    expandSettingsEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    expandRoutesEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    expandRoutesSettingsEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    routeTitleChangedEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    routeColorChangedEvent: EventEmitter<string> = new EventEmitter<string>();

    public zones$: { [key: number]: PlanningDeliveryZone };

    zoneState$: Observable<PlanningDeliveryZone>;
    route$: Observable<Route> = null;
    routesInfoChips$: Observable<{
        customerWaitTime: number;
        vehicleWaitTime: number;
        // delayTime: number;
        // avgCustomerWaitTime: number;
        // avgDelayTime: number;
        travelDistance: number;
        // travelTime: number;
        time: number;
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
    }>;

    togglePointsExpansion(expand: boolean) {
        this.expandPointsEvent.emit(expand);
    }

    
    toggleRoutesSettingsExpansion(expand: boolean) {
        this.expandRoutesSettingsEvent.emit(expand);
    }

    toggleSettingsExpansion(expand: boolean) {
        this.expandSettingsEvent.emit(expand);
    }

    addDeliveryPoint() {
        this.zoneState$.pipe(take(1)).subscribe(zone => {
            const dialogRef = this.ngDialog.open(ModalDeliveryPointsComponent, {
                size: 'xl',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static'
            });
            dialogRef.componentInstance.isEvaluted = zone.evaluated;
            dialogRef.componentInstance.routePlanningDeliveryZoneId = this.zone.id;
    
            dialogRef.result.then((data) => {
            })
        });        
    }

    moveDeliveryPoint() {
        this.facade.planningSession$.pipe(take(1)).subscribe((planningSession) => {
            this.zoneState$.pipe(take(1)).subscribe(zone => { 
                const dialogRef = this.ngDialog.open(MoveMultipleDeliveryPointComponent, {
                    size: 'xl',
                    backdropClass: 'customBackdrop',
                    centered: true,
                    backdrop: 'static'
                })
                dialogRef.componentInstance.zones = planningSession.deliveryZones;
                dialogRef.componentInstance.deliveryPoints = zone.deliveryPoints;
                dialogRef.componentInstance.zoneId = this.zone.id;
                dialogRef.componentInstance.zoneIdDestiny = this.zone.id;
        
                dialogRef.result.then((data) => {
                    if (data) {
                        this.loading.showLoading();
                        this.facade.moveMultipleDeliveryPoint(data);
                        this.facade.moving$.pipe(take(2)).subscribe((moved) => {
                            if (!moved) {
                                this.loading.hideLoading();
                            }
                        });
                    }
                });
            });
        });
    }

    moveDeliveryPointOptim(assign: boolean = true) {
        this.route$.pipe(take(1)).subscribe(route => { 
            const dialogRef = this.ngDialog.open(MoveMultipleDeliveryPointOptimizedComponent, {
                size: 'xl',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static'
            })
            dialogRef.componentInstance.deliveryPoints =  assign ? route.deliveryPoints : route.deliveryPointsUnassigned;
            dialogRef.componentInstance.zoneId = this.zone.id;
            dialogRef.componentInstance.zoneIdDestiny = this.zone.id;
            dialogRef.componentInstance.zones = this.zones$;
            dialogRef.componentInstance.selectedZoneId = this.zone.id;
            dialogRef.componentInstance._selectedZoneId = this.zone.id;
            dialogRef.componentInstance.selectedRouteId = this.routeId;
            dialogRef.componentInstance._selectedRouteId = this.routeId;
    
            dialogRef.result.then((data) => {
                if (data) {
                    this.loading.showLoading();
                    this.facade.moveMultipleDeliveryPointOptimized(data);
                    this.facade.moving$.pipe(take(2)).subscribe((moved) => {
                        if (!moved) {
                            this.loading.hideLoading();
                        }
                    });
                }
            });
        });
    }

    color: {
        hue: 60;
        saturation: 90;
        lightness: 53;
    };
    isExpandedLocal: boolean = false
    isExpandedRouteLocal: boolean = false;

    toggleExpansion(){
        this.isExpandedLocal = !this.isExpandedLocal;
        this.expandEvent.emit(this.isExpandedLocal);
        this.detectChange.detectChanges();
        /* $('#collapse' + this.zone.id).collapse('toggle'); */
    }

    retrieveRoute() {
        this.route$ = this.facade.getZoneRouteById(this.zone.id, this.routeId);
    }

    deleteZone(){
        const modal = this._modalService.open(ConfirmModalComponent, {
            size: 'xs',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        modal.componentInstance.message ='¿Estás seguro de que quieres eliminar esta ruta?'
        modal.result.then((data) => {
            if(data){
                this.facade.deleteRouteDeliveryZone(this.zone.id);
            }
        });
    }

    constructor(
        private detectChange: ChangeDetectorRef,
        private ngDialog: NgbModal,
        private facade: RoutePlanningFacade,
        private loading: LoadingService,
        private _modalService: NgbModal
    ) {}

    ngOnInit() {
        //this.isExpandedLocal = this.isExpanded;
        this.zoneState$ = this.facade.getZoneById(this.zone.id);
        this.routesInfoChips$ = this.facade.getZoneRoutesInfoChips(this.zone.id);
        this.routePlanning$ = this.facade.allRoutePlanning$;
        this.zoneOptimizationStatus$ = this.facade.getOptimizationStatus(this.zone.id);
        if (this.routeId) {
            this.retrieveRoute();
        }

        if(this.isExpanded){
            this.detectChange.detectChanges();
           // $('#collapse' + this.zone.id).collapse('toggle');
        }
    }

    toggleRoute(routeIndex){
        this.facade.toggleRoute(this.zone.id, routeIndex);
    }

    showRouteGeometry(currentRoute){
        this.facade.showRouteGeometry(this.zone.id, this.zone.optimization.solution.routes[currentRoute].id)
    }

    toggleSelectRoute(currentRouteId) {
        if (this.routesStatus[currentRouteId].selected) {
            if (this.highlightedRoute === currentRouteId)
                this.facade.highlightRoute(-1);
        } else {
            this.facade.highlightRoute(currentRouteId);
            if (!this.zoneStatus.selected) this.facade.toggleSelectZone(this.zone.id);
        }
        this.facade.toggleSelectRoute(this.zone.id, currentRouteId);
    }

    getCurrentRouteId(currentRoute) {
        return this.zone.optimization &&
            this.zone.optimization.solution &&
            this.zone.optimization.solution.routes &&
            currentRoute < this.zone.optimization.solution.routes.length &&
            this.zone.optimization.solution.routes[currentRoute]
            ? this.zone.optimization.solution.routes[currentRoute].id
            : null;
    }

    getRouteInfoChip(currentRoute){
        return this.facade.getZoneRouteInfoChips(
            this.zone.id,
            this.zone.optimization.solution.routes[currentRoute].id,
        );
    }
    headerExpandIcon(expanded: boolean) {
        if (expanded !== this.isExpanded) this.isExpanded = expanded;
        return expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right';
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes.routeId &&
            changes.routeId.previousValue !== changes.routeId.currentValue
        ) {
            this.retrieveRoute();
        }

        /* if(this.isExpandedLocal){

            setTimeout(()=>{
                $('#collapse' + this.zone.id).collapse('show');
                this.detectChange.detectChanges();
            }, 1000);
           
        } */

    }
}
