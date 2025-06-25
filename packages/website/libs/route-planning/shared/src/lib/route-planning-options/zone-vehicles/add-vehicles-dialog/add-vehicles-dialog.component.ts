import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StateVehiclesService, VehiclesFacade } from '@optimroute/state-vehicles';
import { Inject } from '@angular/core';
import { PlanningDeliveryZone, RoutePlanningFacade } from '@optimroute/state-route-planning';
import { combineLatest } from 'rxjs';
import { BackendService, Vehicle } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { StateUsersFacade } from '@optimroute/state-users';
@Component({
    selector: 'easyroute-add-vehicles-dialog',
    templateUrl: './add-vehicles-dialog.component.html',
    styleUrls: ['./add-vehicles-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AddVehiclesDialogComponent implements OnInit {
    routingOutputId: number = null;
    zoneId: number = null;
    data: any;

    availableVehicles: Vehicle[] = [];
    vehiclesInUse: Vehicle[] = [];
    selectedAvailableVehicles: Boolean[] = [];
    selectedUsedVehicles: Boolean[] = [];
    vehicleSelected: number[] = [];
    vehicleInUseZone: Vehicle[] = []
    feetUser = [];

    /**
     * Function executed when clicking the cancel button in th dialog. It closes the dialog
     * without any response or update to the service.
     */
    cancelSelection() {
        this.dialogRef.close();
    }

    /**
     * Function executed when clicking the accept button in th dialog. It executes a function
     * in the service so that it properly updates the usedVehicles. Then it closes the dialog
     * without any response.
     */
    addSelection() {
        let vehiclesToAdd: Vehicle[] = []; // suposant que la api no ho retorna aixi
        if (this.vehicleSelected && this.vehicleSelected.length > 0) {

            this.vehicleSelected.forEach(element => {
                if (this.availableVehicles.find(x => x.id === element)) {
                    vehiclesToAdd.push(this.availableVehicles.find(x => x.id === element));
                } else {
                    vehiclesToAdd.push(this.vehiclesInUse.find(x => x.id === element));
                }
            });

            if (this.vehicleInUseZone.length > 0) {
                this.vehicleInUseZone.forEach(element => {

                    if (!vehiclesToAdd.find(x => x.id === element.id)) {
                        vehiclesToAdd.push(element);
                    }

                });
            }

            if (vehiclesToAdd.length !== 0) {
                
                this.routePlanningFacade.getZoneById(this.zoneId).pipe(take(1)).subscribe((zone)=>{

                    this.usersFacade.allUsersDrivers$.pipe(take(1)).subscribe((users)=>{
                        vehiclesToAdd.forEach(element =>{
                            let user = users.find(x=> x.id == element.userId);


                            this.routePlanningFacade.useVehicle(this.zoneId, vehiclesToAdd, (user && user.userTypeId == 2 ? false : zone.evaluated));
                            
                            this.loadFeeCostDriver(element.userId, element.id, true);
                        })
                    });
                    

                    
                });
            }

            this.dialogRef.close(vehiclesToAdd.length > 0 ? true : false);
        }
    }


    loadFeeCostDriver(userId: number, vehicleId: number ,change: boolean = false){
        this.backend.get('user_fee_cost_list/' + userId).pipe(take(1)).subscribe(({data})=>{
            this.feetUser[vehicleId] = data;

            if(change){
                let predetermined = this.feetUser[vehicleId].find(x => x.predetermined === true);
                if(predetermined){
                    this.routePlanningFacade.addFeet(this.zoneId, predetermined.id, vehicleId, false);
                }
            }
        });
    }

    addToSelected(checked, value) {

        const index = this.vehicleSelected.findIndex(x => x === value);

        if (checked) {
            this.vehicleSelected.push(value);
        } else {
            this.vehicleSelected.splice(index, 1);
        }
    }

    constructor(
        public dialogRef: NgbActiveModal,
        private vehiclesService: StateVehiclesService,
        private routePlanningFacade: RoutePlanningFacade,
        private vehiclesFacade: VehiclesFacade,
        private preferencesFacade: PreferencesFacade,
        private changeDetectorRef: ChangeDetectorRef,
        private backend: BackendService,
        private usersFacade: StateUsersFacade
    ) { }

    async ngOnInit() {
        const preferences = await this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).toPromise();
        this.zoneId = this.data.zoneId;
        this.vehiclesInUse = [];
        combineLatest(
            this.vehiclesFacade.allVehicles$,
            this.routePlanningFacade.planningSessionVehicles$,
        )
            .pipe(take(1))
            .subscribe((combinedObservables: [Vehicle[], {}]) => {
                if (combinedObservables[0] && combinedObservables[1]) {
                    this.vehiclesInUse = [];
                    for (let zoneId in combinedObservables[1]) {
                        if (+zoneId !== this.zoneId) {

                            if (combinedObservables[1][zoneId].length > 0) {
                                combinedObservables[1][zoneId].forEach(element => {

                                    if (!this.vehiclesInUse.find(x => element.id === x.id)) {
                                        this.vehiclesInUse.push(combinedObservables[0].find(x => x.id === element.id));
                                    }

                                });
                            }

                        }

                        if (+zoneId === this.zoneId) {
                            if (combinedObservables[1][zoneId].length > 0) {
                                combinedObservables[1][zoneId].forEach(element => {
                                    if (!this.vehicleInUseZone.find(x => element.id === x.id)) {
                                        this.vehicleInUseZone.push(combinedObservables[0].find(x => x.id === element.id));
                                    }


                                });
                            }
                        }
                    }


                    const vehicles = combinedObservables[0].filter(
                        (x) => {

                            const date = moment(); // Thursday Feb 2015
                            let dow = date.isoWeekday();

                            if (!preferences.assignedNextDay) {
                                dow = dow - 1;
                            }
                            let user = x.userId && x.userId > 0;
                            let schedule = x.deliveryPointScheduleTypeId === 1
                                ? x.schedules && x.schedules[dow] && x.schedules[dow].isActive : false;
                            return user && (x.deliveryPointScheduleTypeId === 1) ? schedule : true;
                        },
                    );
                    for (let vehicle of vehicles) {
                        if (!this.findVehicle(vehicle.id, combinedObservables[1])) {
                            this.availableVehicles.push(vehicle);
                        }
                    }
                    this.selectedAvailableVehicles = new Array(
                        this.availableVehicles.length,
                    ).fill(false);
                    this.selectedUsedVehicles = new Array(
                        this.availableVehicles.length,
                    ).fill(false);
                    this.changeDetectorRef.detectChanges();
                } else {
                    this.availableVehicles = [];
                    this.vehiclesInUse = [];
                }
            });
    }

    private findVehicle(vehicleId: number, vehiclesInZones: {}): boolean {
        let found = false;
        for (let zoneId in vehiclesInZones) {
            vehiclesInZones[zoneId].forEach((v) => {
                if (v.id === vehicleId) found = true;
            });

        }
        return found;
    }

    selectVehicle(index) {
        this.selectedAvailableVehicles = [];
        this.selectedAvailableVehicles.push(index);
    }
}
