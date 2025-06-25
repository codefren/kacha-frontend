import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';
import { Vehicle } from '@optimroute/backend';
import {
    PlanningDeliveryZone,
    PlanningSession,
    RoutePlanningFacade,
    RoutePlanningState,
    DeliveryZoneStatus,
} from '@optimroute/state-route-planning';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { Observable, Subscription, Subject } from 'rxjs';
import { withLatestFrom, takeUntil, take } from 'rxjs/operators';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { ProfileSettingsFacade, StateProfileSettingsService } from '@optimroute/state-profile-settings';
import { Profile } from '../../../../backend/src/lib/types/profile.type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'easyroute-route-planning-sidenav',
    templateUrl: './route-planning-sidenav.component.html',
    styleUrls: ['./route-planning-sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlanningSidenavComponent implements OnInit, OnDestroy {
    public sidenavOpened$: Observable<boolean>;
    public routePlanning$: Observable<RoutePlanningState>;
    public vehicles$: Observable<Vehicle[]>;
    public planningSession$: Observable<PlanningSession>;
    public zones$: Observable<{ [key: number]: PlanningDeliveryZone }>;
    public routesSubscription: Subscription;
    public selectedPoint$: Observable<number>;
    public hoveredPoint$: Observable<number>;
    public highlightedRoute$: Observable<number>;
    public showSelected$: Observable<boolean>;
    public routeGeometries: { routeId: number; polyline: string }[] = [];
    public zoneStatus$: Observable<{ [zoneId: number]: DeliveryZoneStatus }>;
    public routeStatus$: Observable<{
        [zoneId: number]: { [routeId: number]: { selected: boolean; displayed: boolean } };
    }>;
    profile: Profile;
    unsubscribe$ = new Subject<void>();

    constructor(
        private routePlanningFacade: RoutePlanningFacade,
        private vehiclesFacade: VehiclesFacade,
        private easyRouteFacade: StateEasyrouteFacade,
        public facadeProfile: ProfileSettingsFacade,
        public  profileService: StateProfileSettingsService
    ) {}

    //TODO:
    // aquesta merda???
    // es necessia tanta merda???
    // alguns inclouen altres...

    ngOnInit() {
        this.easyRouteFacade.isAuthenticated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isAuthenticated => {
                if (isAuthenticated) {
                    this.vehiclesFacade.loadAll();
                }
            });
        this.sidenavOpened$ = this.routePlanningFacade.sideNavState$;
        this.routePlanning$ = this.routePlanningFacade.allRoutePlanning$;
        this.planningSession$ = this.routePlanningFacade.planningSession$;
        this.vehicles$ = this.vehiclesFacade.allVehicles$;
        this.zones$ = this.routePlanningFacade.allZones$;
        this.zones$
            .pipe(
                takeUntil(this.unsubscribe$),
                withLatestFrom(this.routePlanningFacade.allZonesStatus$),
            )
            .subscribe(([zones, zonesStatus]) => {
                if (zones) {
                    for (const key in zones) {
                        if (zones[key] && zonesStatus[key] 
                            && zonesStatus[key].optimized
                            && zones[key].optimization
                            && zones[key].optimization.solution
                            && zones[key].optimization.solution.routes) {
                            const routes = zones[key].optimization.solution.routes.map(
                                route => {
                                    return {
                                        routeId: route.id,
                                        polyline: route.geometry,
                                    };
                                },
                            );
                            this.routeGeometries = this.routeGeometries.concat(routes);
                        }
                    }
                }
            });
            this.facadeProfile.loaded$.pipe(take(1)).subscribe( (loaded)=>{
                if (loaded) {
                    this.facadeProfile.profile$.pipe(take(1)).subscribe((data)=>{
                        this.profile = data;
                    });
                    
                }
            });
        this.selectedPoint$ = this.routePlanningFacade.selectedDeliveryPoint$;
        this.hoveredPoint$ = this.routePlanningFacade.hoveredDeliveryPoint$;
        this.highlightedRoute$ = this.routePlanningFacade.highlightedRoute$;
        this.showSelected$ = this.routePlanningFacade.showSelected$;
        this.zoneStatus$ = this.routePlanningFacade.allZonesStatus$;
        this.routeStatus$ = this.routePlanningFacade.allRoutesStatus$;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
