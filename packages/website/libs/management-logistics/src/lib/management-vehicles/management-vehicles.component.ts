import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Vehicle, Zone, Profile } from '@optimroute/backend';
import { StateDeliveryZonesFacade, DeliveryZones } from '@optimroute/state-delivery-zones';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';

@Component({
    selector: 'easyroute-management-vehicles',
    templateUrl: './management-vehicles.component.html',
    styleUrls: ['./management-vehicles.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementVehiclesComponent implements OnInit, OnDestroy {
    vehicles$: Observable<Vehicle[]>;
    zones$: Observable<DeliveryZones>;
    profile$: Observable<Profile>;
    unsubscribe$ = new Subject<void>();

    constructor(
        private vehiclesFacade: VehiclesFacade,
        private deliveryZonesFacade: StateDeliveryZonesFacade,
        private easyRouteFacade: StateEasyrouteFacade,
        private profileFacade: ProfileSettingsFacade,
    ) {}

    ngOnInit() {
        this.loadState();
    }

    private loadState() {
        this.easyRouteFacade.isAuthenticated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isAuthenticated => {
                if (isAuthenticated) {
                    /* this.deliveryZonesFacade.loadAll(); */
                    //this.vehiclesFacade.loadAll();
                    // this.profileFacade.loadAll();
                }
            });

        this.zones$ = this.deliveryZonesFacade.state$;
        this.zones$.pipe(takeUntil(this.unsubscribe$)).subscribe(zoneState => {
            if (zoneState.loaded) {
                this.profile$ = this.profileFacade.profile$;
                this.vehicles$ = this.vehiclesFacade.allVehicles$;
            }
        });
    }

    addVehicle(vehicle: Vehicle) {
        this.vehiclesFacade.addVehicle(vehicle);
    }

    editVehicle(obj: [number, Partial<Vehicle>]) {
        this.vehiclesFacade.editVehicle(obj[0], obj[1]);
    }

    deleteVehicle(id: number) {
        this.vehiclesFacade.deleteVehicle(id);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
