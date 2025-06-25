import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
    ChangeDetectorRef,
} from '@angular/core';
import {
    DeliveryZoneStatus,
    PlanningDeliveryZone,
    Route,
    RoutePlanningFacade,
    DeliveryPoint,
} from '@optimroute/state-route-planning';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { InterfacePreferences, ManagementPreferences, OptimizationPreferences } from '@optimroute/backend';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeliveryPointsComponent } from '../modal-delivery-points/modal-delivery-points.component';
import { ChangeRouteModalComponent } from '../change-route-modal/change-route-modal.component';
import { MoveMultipleDeliveryPointComponent } from '../move-multiple-delivery-point/move-multiple-delivery-point.component';
import { LoadingService } from '@optimroute/shared';
import { MoveMultipleDeliveryPointOptimizedComponent } from '../move-multiple-delivery-point-optimized/move-multiple-delivery-point-optimized.component';
@Component({
    selector: 'easyroute-route-planning-table',
    templateUrl: './route-planning-table.component.html',
    styleUrls: ['./route-planning-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlanningTableComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    zoneId: number = null;

    @Input()
    routeId: number = null;
    
    public zones$: { [key: number]: PlanningDeliveryZone };

    hoveredPointId: Observable<number>;

    zoneState$: Observable<PlanningDeliveryZone>;
    zoneStatus$: Observable<DeliveryZoneStatus>;
    route$: Observable<Route> = null;

    zoneColor: string = '#000000';

    isElementBeingDragged = false;

    interferencePreferences$: Observable<InterfacePreferences>;

    optimizationPreferences$: Observable<OptimizationPreferences>;

    managementPreferences$: Observable<ManagementPreferences>;

    selectedPoint$: Observable<number>;

    isExpandedLocal: boolean = false

    closeComplete: boolean = false;
    

    private unsubscribe$ = new Subject<void>();

    setPriority(dpIdentifier: number, newValue: number) {
        console.log('entro ' + dpIdentifier + ' ' + newValue);
        this.facade.setPriority(this.zoneId, dpIdentifier, newValue);
    }

    getTableElementId(deliveryPointId: number) {
        return 'delivery-point-table-container-' + deliveryPointId;
    }

    dragElement() {
        this.isElementBeingDragged = true;
    }

    dropElement() {
        this.isElementBeingDragged = false;
    }

    trackById(index, item) {
        return item.id;
    }

    async drop(event: CdkDragDrop<string[]>) {
        await this.loading.showLoading();
        this.facade.moving$.pipe(take(2)).subscribe(async (moving)=>{
            if(!moving){
                this.loading.hideLoading();
            }
        })
        if (!this.routeId) {
            console.log(event);
            if (event.previousIndex !== event.currentIndex) {
                this.zoneState$.pipe(take(1)).subscribe(zone => {
                    console.log(zone);
                    const deliveryPointId = zone.deliveryPoints[event.previousIndex].id;
                    this.facade.deliveryPointZoneMovement(
                        deliveryPointId,
                        this.zoneId,
                        this.zoneId,
                        event.previousIndex + 1,
                        event.currentIndex + 1,
                        false,
                        zone.evaluated,
                        
                    );
                });
            }
        } else {
            if (event.previousIndex !== event.currentIndex) {
                this.zoneState$.pipe(take(1)).subscribe((zone: PlanningDeliveryZone) => {
                    const route = zone.optimization.solution.routes.find((route: Route) => {
                        return route.id === this.routeId;
                    });
                    const deliveryPointId = route.deliveryPoints[event.previousIndex].id;
                    this.facade.deliveryPointRouteMovement(
                        deliveryPointId,
                        this.zoneId,
                        this.zoneId,
                        this.routeId,
                        this.routeId,
                        event.previousIndex + 1,
                        event.currentIndex + 1,
                        false,
                        zone.evaluated
                    );
                });
            }
        }
    }
    selectDeliveryPoint(deliveryPointId: number): void {
        this.facade.selectDeliveryPoint(deliveryPointId);
    }
    changeHovered(hoveredPointId) {
        if (!this.isElementBeingDragged)
            this.facade.setHoveredDeliveryPoint(hoveredPointId);
    }

    getListId(): string {
        if (this.routeId) {
            return 'cdk-drop-list-route-' + this.zoneId + '-' + this.routeId;
        } else {
            return 'cdk-drop-list-zone-' + this.zoneId;
        }
    }

    retrieveRoute() {
        this.route$ = this.facade.getZoneRouteById(this.zoneId, this.routeId);
        this.route$.pipe(take(1)).subscribe((data)=>{
            this.zoneColor = data.color;
        })
    }

    highlightRoute(routeId: number) {
        this.facade.highlightRoute(routeId);
    }

    isFree(end: boolean, seconds: number): boolean {
        if (end) {
            return seconds === 3600 * 24 - 1 || seconds === undefined || seconds === null;
        } else {
            return seconds === 0 || seconds === null || seconds === undefined;
        }
    }

    constructor(private facade: RoutePlanningFacade,
        private facadePreferense: PreferencesFacade,
        private loading: LoadingService,
        private detectChange: ChangeDetectorRef,
        private ngDialog: NgbModal) { }

    ngOnInit() {

        this.selectedPoint$ = this.facade.selectedDeliveryPoint$;
        this.zoneStatus$ = this.facade.getZoneStatus(this.zoneId);
        this.zoneState$ = this.facade.getZoneById(this.zoneId);
        if(this.routeId === null){
            this.facade.getZoneById(this.zoneId).subscribe( (zone: any) => {
            
                if (zone && zone.color != '#ffffff' ) {
                    this.zoneColor = zone.color;
                }
            }); 
        }
        
        this.interferencePreferences$ = this.facadePreferense.interfacePreferences$;
        this.optimizationPreferences$ = this.facadePreferense.optimizationPreferences$;
        this.managementPreferences$ = this.facadePreferense.managementPreferences$;

        if (this.routeId) {
            this.retrieveRoute();
        }
        
        this.hoveredPointId = this.facade.hoveredDeliveryPoint$;

        this.facade.allRoutePlanning$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            this.closeComplete =  data.closeComplete;
            try{
                this.detectChange.detectChanges();
            }catch(e){

            }
        })
    }

    parseFloat(demand: number){
        return demand.toFixed(2);
    }

    changeRoute(deliveryPoint: DeliveryPoint){
        const dialogRef = this.ngDialog.open(ChangeRouteModalComponent, {
            size: 'lg',
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.componentInstance.zones = this.zones$;
        dialogRef.componentInstance.selectedZoneId = this.zoneId;
        dialogRef.componentInstance._selectedZoneId = this.zoneId;
        dialogRef.componentInstance.selectedRouteId = this.routeId;
        dialogRef.componentInstance._selectedRouteId = this.routeId;
        dialogRef.componentInstance.deliveryPoint = deliveryPoint;
        dialogRef.componentInstance.order = deliveryPoint.order;
        dialogRef.componentInstance._order = deliveryPoint.order;

        dialogRef.result.then((data) => {
            console.log(data);
        })
    }

    delete(id){
        
        this.zoneStatus$.pipe(take(1)).subscribe((data)=>{
            this.facade.deleteDeliveryPoint(id, this.zoneId, data.evaluated);
        })
        
    }
    /*
    ngOnInit() {
        this.planningSession$ = this.facade.planningSession$;
        this.zoneState$ = this.facade.getZoneById(this.zoneId);
        if (this.routeId) {
            this.switchRoute();
        } else {
            this.deliveryPoints$ = this.zoneState$.pipe(
                takeUntil(this.unsubscribe$),
                map((item: PlanningDeliveryZone) => {
                    if (item) return item.deliveryPoints;
                }),
            );
        }
    }
*/
    ngOnChanges(changes: SimpleChanges) {
        if (
            changes.routeId &&
            changes.routeId.previousValue !== changes.routeId.currentValue
        ) {
            this.retrieveRoute();
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    // openDeliveryPointSettings(deliveryPointId: number, order: number) {
    //     //console.log('openDeliveryPointSettings');
    //     this.dialog.open(EditDeliveryPointComponent, {
    //         data: {this.route$
    //             zoneId: this.zoneId,
    //             deliveryPointId: deliveryPointId,
    //             order: order,
    //         },
    //         hasBackdrop: true,
    //         panelClass: 'edit-delivery-point-mat-dialog-container',
    //     });
    // }

    // getConnectedLists(): string[] {
    //     let idList: string[] = [];
    //     if (this.routeId) {
    //         this.planningSession$
    //             .pipe(takeUntil(this.unsubscribe$))
    //             .subscribe(planningSession =>
    //                 planningSession.deliveryZones.forEach(deliveryZone => {
    //                     if (
    //                         deliveryZone.optimization &&
    //                         deliveryZone.optimization.solution &&
    //                         deliveryZone.optimization.solution.routes
    //                     ) {
    //                         deliveryZone.optimization.solution.routes.forEach(
    //                             individualRoute => {
    //                                 const r =
    //                                     'cdk-drop-list-route-' +
    //                                     deliveryZone.id +
    //                                     '-' +
    //                                     individualRoute.id;
    //                                 idList.push(r);
    //                             },
    //                         );
    //                     }
    //                 }),
    //             );
    //     } else {
    //         this.planningSession$
    //             .pipe(takeUntil(this.unsubscribe$))
    //             .subscribe(planningSession => {
    //                 planningSession.deliveryZones.forEach(deliveryZone => {
    //                     const r = 'cdk-drop-list-zone-' + deliveryZone.id;
    //                     idList.push(r);
    //                 });
    //             });
    //     }
    //     return idList;
    // }
}
