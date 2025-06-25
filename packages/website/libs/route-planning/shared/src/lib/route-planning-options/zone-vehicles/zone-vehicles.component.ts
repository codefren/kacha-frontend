import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Vehicle, User, BackendService, ManagementPreferences } from '@optimroute/backend';
import { PlanningDeliveryZone, Route, RoutePlanningFacade, RoutePlanningState } from '@optimroute/state-route-planning';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { AddVehiclesDialogComponent } from './add-vehicles-dialog/add-vehicles-dialog.component';
import { Vehicles } from 'libs/state-vehicles/src/lib/+state/vehicles.reducer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    takeUntil,
    pairwise,
    startWith,
    concat,
    concatMap,
    concatAll,
    withLatestFrom,
    take,
} from 'rxjs/operators';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { StateUsersFacade } from '@optimroute/state-users';
import * as _ from 'lodash';
import { dayTimeAsStringToSeconds, LoadingService, secondsToDayTimeAsString, ToastService } from '@optimroute/shared';
import { ModalFormVehiclesComponent } from 'libs/management-logistics/src/lib/management-vehicles/management-vehicles-table/modal-form-vehicles/modal-form-vehicles.component';
import { ModalDeliveryPointsComponent } from '../../modal-delivery-points/modal-delivery-points.component';
import { MoveMultipleDeliveryPointOptimizedComponent } from '../../move-multiple-delivery-point-optimized/move-multiple-delivery-point-optimized.component';
import { MoveMultipleDeliveryPointComponent } from '../../move-multiple-delivery-point/move-multiple-delivery-point.component';
import { ServiceTypeVehicleComponent } from './service-type-vehicle/service-type-vehicle.component';
import { PreferencesFacade } from '@optimroute/state-preferences';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { AddCrossDockingComponent } from './add-cross-docking/add-cross-docking.component';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { AuthLocalService } from '@optimroute/auth-local';

@Component({
    selector: 'easyroute-zone-vehicles',
    templateUrl: './zone-vehicles.component.html',
    styleUrls: ['./zone-vehicles.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneVehiclesComponent implements OnInit, OnDestroy {
    /**
     *  Input parameter that determines actual zone Id in the routing output.
     */
    @Input()
    zoneId: number;

    ownVehicles: Vehicle[] = [];

    @Input()
    zone: PlanningDeliveryZone;

    @Input()
    routeId: number = null;

    unsubscribe$ = new Subject<void>();

    vehiclesType: any;

    drivers: Observable<User[]>;

    routePlanning$: Observable<RoutePlanningState>;

    zoneState$: Observable<PlanningDeliveryZone>;

    managementPreferences: ManagementPreferences;

    public zones$: { [key: number]: PlanningDeliveryZone };

    route$: Observable<Route> = null;

    day: number;

    profile: any;

    feetUser = [];

    /* vehiculos que no han sido usado en otras rutas */

    vehiclesInUse: Vehicle[] = [];

    vehicleInUseZone: Vehicle[] = [];

    availableVehicles: Vehicle[] = [];

    selectedAvailableVehicles: Boolean[] = [];

    selectedUsedVehicles: Boolean[] = [];

    addCrossDocking() {
        const dialogRef = this.dialog.open(AddCrossDockingComponent, {
            size: 'xs',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.componentInstance.crossdocking = this.zone.crossDocking;


        dialogRef.result.then((result) => {
            console.log(result);
            if (result[0]) {
                this.facade.addCrossDocking(result[1], this.zoneId, this.zone.evaluated);
            }
        })
    }

    addVehicles() {
        const dialogRef = this.dialog.open(AddVehiclesDialogComponent, {
            size: 'md',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.componentInstance.data = {
            zoneId: this.zoneId,
        };

        dialogRef.result.then(async data => {

            if (data) {

                const preferences = await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise();
                if (preferences.createSession.autoEvaluateOnCharge) {
                    this.evalute();
                }
            }
        });
    }
    stopUsingVehicle(vehicleId: number) {
        this.facade.stopUsingVehicle(this.zoneId, vehicleId, this.zone);
    }
    toggleUseAllVehicles(value: boolean) {
        this.facade.toggleUseAllVehicles(this.zoneId, value);
    }
    toggleIgnoreCapacityLimit(value: boolean) {
        this.facade.toggleIgnoreCapacityLimit(this.zoneId, value);
    }

    toggleUserSkills(value: boolean) {
        this.facade.toggleUserSkill(this.zoneId, value);
    }

    onChangeVehicleName(name: string, vehicleId: number) {
        if (name.length >= 2) {
            let vehicle = _.cloneDeep(this.ownVehicles.find((x) => x.id === vehicleId));
            vehicle.name = name;
            delete vehicle.vehicleTypeId;
            delete vehicle.vehicleServiceType;
            delete vehicle.deliveryPointScheduleTypeId;
            this.vehicleFacade.editVehicle(vehicleId, vehicle, this.zoneId);
        }
    }

    trackById(index, item) {
        return item.id;
    }
    async onChangeVehicleDeliveryWindowStart(time: string, vehicleId: number) {

        console.log('aquiii entro');

        let vehicle: any = _.cloneDeep(this.ownVehicles.find((x) => x.id === vehicleId));
        vehicle.deliveryWindowStart = dayTimeAsStringToSeconds(time);
        vehicle.timeStart = dayTimeAsStringToSeconds(time);
        delete vehicle.vehicleTypeId;
        delete vehicle.vehicleServiceType;
        delete vehicle.deliveryPointScheduleTypeId;

        vehicle.timeStart = vehicle.deliveryWindowStart;
        const preferences = await this.preferencesFacade.managementPreferences$.pipe(take(1)).toPromise();
        if (preferences.updateDeliveryZoneDeliveryStartOnOpt) {
            this.vehicleFacade.editVehicle(vehicleId, vehicle, this.zoneId);
        } else {
            this.facade.updateVehicle({ vehicleId, results: vehicle, zoneId: this.zoneId });
        }

    }
    async onChangeVehicleDeliveryWindowEnd(time: string, vehicleId: number) {
        let vehicle: any = _.cloneDeep(this.ownVehicles.find((x) => x.id === vehicleId));
        vehicle.deliveryWindowEnd = dayTimeAsStringToSeconds(time);
        vehicle.timeEnd = dayTimeAsStringToSeconds(time);
        delete vehicle.vehicleTypeId;
        delete vehicle.deliveryPointScheduleTypeId;


        vehicle.timeEnd = vehicle.deliveryWindowEnd;
        const preferences = await this.preferencesFacade.managementPreferences$.pipe(take(1)).toPromise();

        if (preferences.updateDeliveryZoneDeliveryEndOnOpt) {
            this.vehicleFacade.editVehicle(vehicleId, vehicle, this.zoneId);
        } else {
            this.facade.updateVehicle({ vehicleId, results: vehicle, zoneId: this.zoneId });
        }
    }

    onChangeVehicleCapacity(capacity: number, vehicleId: number) {
        let vehicle = _.cloneDeep(this.ownVehicles.find((x) => x.id === vehicleId));
        vehicle.capacity = capacity;
        delete vehicle.vehicleTypeId;
        delete vehicle.deliveryPointScheduleTypeId;
        this.vehicleFacade.editVehicle(vehicleId, vehicle, this.zoneId);
    }

    onChangeDriver(userId: number, vehicleId) {
        let vehicle = _.cloneDeep(this.ownVehicles.find((x) => x.id === vehicleId));
        vehicle.userId = userId;
        delete vehicle.vehicleTypeId;
        delete vehicle.deliveryPointScheduleTypeId;
        /* this.vehicleFacade.editVehicle(vehicleId, vehicle, this.zoneId); */

        this.drivers.pipe(take(1)).subscribe((users) => {

            this.facade.changeDriverVehicle(this.zoneId, userId, vehicleId, users.find(x => x.id === +userId));
            this.feetUser[vehicleId] = [];
            if (users && users.find(x => x.id === +userId) && users.find(x => x.id == +userId).userTypeId && +users.find(x => x.id === +userId).userTypeId == 2) {
                this.loadFeeCostDriver(userId, vehicleId, true);
            } else if (this.zone.evaluated) {
                this.facade.evaluate({ zoneIds: [this.zone.id] })
            }
        });
    }

    changeFee(feeId, vehicleId) {

        this.facade.addFeet(this.zoneId, feeId, vehicleId, this.zone.evaluated);
    }

    loadFeeCostDriver(userId: number, vehicleId: number, change: boolean = false) {
        this.backend.get('user_fee_cost_list/' + userId).pipe(take(1)).subscribe(({ data }) => {
            this.feetUser[vehicleId] = data;

            if (change) {
                let predetermined = this.feetUser[vehicleId].find(x => x.predetermined === true);
                if (predetermined) {
                    this.facade.addFeet(this.zoneId, predetermined.id, vehicleId, this.zone.evaluated);
                }
            }
        });
    }

    convertSecondsToDayTime(value) {
        return secondsToDayTimeAsString(value);
    }

    editVehicle(vehicleId: number) {
        let vehicleSelect = _.cloneDeep(this.ownVehicles.find((x) => x.id === vehicleId));
        let vehiclesType = this.vehiclesType;
        let users = this.drivers;

        /* let zone = this.zones; */
        const dialogRef = this.dialog.open(ModalFormVehiclesComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.data = {
            Vehicle: vehicleSelect,
            edit: true,
            vehiclesType: vehiclesType,
            user: users
            //zone:zone
        };
        dialogRef.result.then(([add, object]) => {
            if (add) {
            }
        });
    }

    getUsers() {
        this.drivers = this.usersFacade.allUsersDrivers$;
    }

    getSliceText(text, limit) {
        if (text.length == 0) {
            return '';
        } else if (text.length > limit) {
            return text.substr(0, limit - 1) + '...';
        } else {
            return text;
        }
    }

    changeSpecificationSchedule(value, vehicle) {
        const speficiation = vehicle.vehicleScheduleSpecification.find(x => +x.id === +value);
        this.facade.changeScheduleSpecification(this.zoneId, vehicle.id, {
            timeEnd: speficiation.company_time_zone.timeEnd,
            timeStart: speficiation.company_time_zone.timeStart,
            vehicleScheduleSpecificationId: +value,
            deliveryPointScheduleTypeId: vehicle.deliveryPointScheduleTypeId
        });

    }

    constructor(
        private facade: RoutePlanningFacade,
        //public dialog: MatDialog,
        private dialog: NgbModal,
        private changeDetector: ChangeDetectorRef,
        private service: StateUsersService,
        private usersFacade: StateUsersFacade,
        private loading: LoadingService,
        public vehicleFacade: VehiclesFacade,
        private preferencesFacade: PreferencesFacade,
        private backend: BackendService,
        private toastService: ToastService,
        private translate: TranslateService,
        private detectChange: ChangeDetectorRef,
        public facadeProfile: ProfileSettingsFacade,
        public authLocal: AuthLocalService,
    ) { }

    ngOnInit() {
        this.getUsers();

        /* this.getVehicle(); */

        this.facade
            .getZoneVehicles(this.zoneId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async vehicles => {
                if (vehicles) {

                    this.ownVehicles = vehicles.map(x => {


                        this.drivers.pipe(take(1)).subscribe((users) => {

                            if (users && users.find(user => +user.id === +x.userId) && +users.find(user => +user.id === +x.userId).userTypeId == 2 && this.feetUser[x.id] === undefined) {
                                let predetermine = x.userFeeCostId && x.userFeeCostId > 0 ? false : true;
                                this.loadFeeCostDriver(x.userId, x.id, predetermine);
                            }

                        })


                        return {
                            ...x,
                            vehicleScheduleSpecificationId:
                                x.vehicleScheduleSpecificationId && x.vehicleScheduleSpecification && x.vehicleScheduleSpecification.length > 0
                                    ? (x.vehicleScheduleSpecification.find(y => y.id === x.vehicleScheduleSpecificationId) ? x.vehicleScheduleSpecificationId : x.vehicleScheduleSpecification[0].id) :
                                    x.activateDeliverySchedule && x.vehicleScheduleSpecification ?
                                        (x.vehicleScheduleSpecification[0] ? x.vehicleScheduleSpecification[0].id : null)
                                        : null,
                            schedules: x.schedules
                        }
                    });

                    this.getVehicle();



                    const preferences = await this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).toPromise();

                    if (preferences.assignedNextDay) {
                        this.day = (moment().isoWeekday());
                    } else {
                        this.day = (moment().isoWeekday() - 1);
                    }



                    this.changeDetector.detectChanges();
                }
            });
        this.vehicleFacade.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe((loaded) => {
            if (loaded) {
                this.vehicleFacade.allVehicles$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((vehicles) => {
                        if (vehicles) {
                            console.log(vehicles, 'vehicleFacade.loaded$');
                            this.ownVehicles = this.ownVehicles.filter(element => {
                                return vehicles.find(x => x.id === element.id) !== undefined;
                            });


                            this.ownVehicles = this.ownVehicles.map((vehicle) => {
                                return {
                                    ...vehicle,
                                    schedules: vehicles.find(x => x.id === vehicle.id).schedules
                                }

                            });

                            try {
                                this.detectChange.detectChanges();
                            } catch (e) {

                            }
                        }

                    });
            }

        });



        this.routePlanning$ = this.facade.allRoutePlanning$;

        this.routePlanning$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
            try {
                this.detectChange.detectChanges();
            } catch (e) {

            }
        })

        this.zoneState$ = this.facade.getZoneById(this.zone.id);

        this.zoneState$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            this.changeDetector.detectChanges();
        });

        if (this.routeId) {
            this.retrieveRoute();
        }

        this.preferencesFacade.managementPreferences$.pipe(take(1)).subscribe((data) => {
            this.managementPreferences = data;
        });

        this.facadeProfile.profile$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                this.profile = data;
            });
    }

    retrieveRoute() {
        this.route$ = this.facade.getZoneRouteById(this.zone.id, this.routeId);
    }

    viewService(vehicle) {
        const dialogRef = this.dialog.open(ServiceTypeVehicleComponent, {
            size: 'xs',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.vehicle = vehicle;

        dialogRef.result.then((data) => { });
    }

    ModuleCost() {

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
            return true;
        } else {
            return false;
        }
    }

    indexDay(vehicle) {
        return vehicle.vehicleScheduleDayId ? vehicle.schedules.findIndex(x => x.id === vehicle.vehicleScheduleDayId) : this.day;
    }

    convertToDecimal(number: number) {
        return number.toFixed(2);
    }

    addDeliveryPoint() {
        this.zoneState$.pipe(take(1)).subscribe((zone) => {
            const dialogRef = this.dialog.open(ModalDeliveryPointsComponent, {
                size: 'xl',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
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
                const dialogRef = this.dialog.open(MoveMultipleDeliveryPointComponent, {
                    size: 'xl',
                    backdropClass: 'customBackdrop',
                    centered: true,
                    backdrop: 'static',
                });
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
            const dialogRef = this.dialog.open(MoveMultipleDeliveryPointOptimizedComponent, {
                size: 'xl',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static'
            })
            dialogRef.componentInstance.deliveryPoints = assign ? route.deliveryPoints : route.deliveryPointsUnassigned;
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

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    changeHourPerDay(value, time: string, vehicleEdit: Vehicle) {

        console.log('aquiiii entrooo');
        let vehicle = this.ownVehicles.find(x => x.id === vehicleEdit.id);

        let hours;

        if (vehicle.schedules
            && vehicle.schedules[this.indexDay(vehicle)]
            && vehicle.schedules[this.indexDay(vehicle)].hours
            && vehicle.schedules[this.indexDay(vehicle)].hours.length > 0) {

            hours = _.cloneDeep(vehicle.schedules[this.indexDay(vehicle)].hours);

        } else {
            hours = [{
                timeStart: 0,
                timeEnd: 86399,
                id: 0
            }]
        }


        if (time === 'start') {

            hours[0].timeStart = dayTimeAsStringToSeconds(value);

        } else {
            hours[0].timeEnd = dayTimeAsStringToSeconds(value);
        }

        let schedules = _.cloneDeep(vehicle.schedules);

        console.log(hours[0]);
        schedules[this.indexDay(vehicle)] = {
            ...schedules[this.indexDay(vehicle)],
            hours: hours
        };

        vehicle = {
            ...vehicle,
            schedules: schedules
        }




        if (vehicle.schedules[this.indexDay(vehicle)].hours[0].id > 0) {

            if (vehicle.schedules[this.indexDay(vehicle)].hours[0].timeStart >= 0
                && vehicle.schedules[this.indexDay(vehicle)].hours[0].timeEnd >= 0) {
                this.backend.put('vehicle_schedule_hour/' + vehicle.schedules[this.indexDay(vehicle)].hours[0].id, vehicle.schedules[this.indexDay(vehicle)].hours[0])
                    .pipe(take(1))
                    .subscribe((response) => {

                        this.facade.changeSchedulesHourd(vehicle.id, this.zoneId, {
                            timeEnd: vehicle.schedules[this.indexDay(vehicle)].hours[0].timeEnd,
                            timeStart: vehicle.schedules[this.indexDay(vehicle)].hours[0].timeStart,
                            deliveryPointScheduleTypeId: vehicle.deliveryPointScheduleTypeId,
                            vehicleScheduleDayId: vehicle.schedules[this.indexDay(vehicle)].id,
                            vehicleScheduleHourId: vehicle.schedules[this.indexDay(vehicle)].hours[0].id,
                            vehicleScheduleSpecificationId: vehicle.vehicleScheduleSpecificationId
                        });
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT')
                        );
                        try {
                            this.detectChange.detectChanges();
                        } catch (e) {

                        }
                    }, error => {
                        this.toastService.displayHTTPErrorToast(error.status, error.error.error)
                    })

            }

        } else {



            let schedule = vehicle.schedules[this.indexDay(vehicle)];

            if (vehicle.schedules[this.indexDay(vehicle)].hours[0].timeStart >= 0
                && vehicle.schedules[this.indexDay(vehicle)].hours[0].timeEnd >= 0
                && vehicle.schedules[this.indexDay(vehicle)].hours[0].timeStart != -1
                && vehicle.schedules[this.indexDay(vehicle)].hours[0].timeEnd != -1) {
                this.backend.post('vehicle_schedule_hour', {

                    vehicleScheduleDayId: schedule.id,
                    timeStart: schedule.hours[0].timeStart,
                    timeEnd: schedule.hours[0].timeEnd

                }).pipe(take(1)).subscribe((response) => {


                    let schedules = _.cloneDeep(vehicle.schedules);

                    hours[0] = {
                        ...hours[0],
                        id: response.data.id
                    };

                    schedules[this.indexDay(vehicle)] = {
                        ...schedules[this.indexDay(vehicle)],
                        hours
                    };

                    vehicle = {
                        ...vehicle,
                        schedules
                    }
                    this.facade.changeSchedulesHourd(vehicle.id, this.zoneId, {
                        timeEnd: vehicle.schedules[this.indexDay(vehicle)].hours[0].timeEnd,
                        timeStart: vehicle.schedules[this.indexDay(vehicle)].hours[0].timeStart,
                        deliveryPointScheduleTypeId: vehicle.deliveryPointScheduleTypeId,
                        vehicleScheduleDayId: vehicle.schedules[this.indexDay(vehicle)].id,
                        vehicleScheduleHourId: vehicle.schedules[this.indexDay(vehicle)].hours[0].id,
                        vehicleScheduleSpecificationId: vehicle.vehicleScheduleSpecificationId
                    });

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.REGISTRATION'),
                        this.translate.instant('GENERAL.ACCEPT')
                    )
                    try {
                        this.detectChange.detectChanges();
                    } catch (e) {

                    }

                }, error => {
                    this.toastService.displayHTTPErrorToast(error.status, error.error.error)
                })
            }

        }


    }


    async evalute() {
        const zoneIds = [];
        const routePlanning = await this.facade.allRoutePlanning$.pipe(take(1)).toPromise();
        if (!routePlanning.deliveryZonesStatus[this.zoneId].evaluated) {
            if (
                await this.canBeEvaluate(
                    routePlanning.planningSession.deliveryZones[this.zoneId],
                )
            ) {
                zoneIds.push(this.zoneId);
            }
        }
        if (zoneIds.length > 0) this.facade.evaluate({ zoneIds });

    }

    private async canBeEvaluate(zone: PlanningDeliveryZone) {
        console.log('aqui cuando añaden un vehicle');
        return this.hasDeliveryPoints(zone);
    }

    private hasVehicles(zone: PlanningDeliveryZone) {
        if (zone.vehicles.length >= 1) return true;
        for (let subZoneId in zone.deliveryZones) {
            if (zone.deliveryZones[subZoneId].vehicles.length >= 1) return true;
        }
        return false;
    }

    private hasDeliveryPoints(zone: PlanningDeliveryZone) {
        if (zone.deliveryPoints.length > 0) return true;
        return false;
    }

    showNotTraffic() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role != 16) !==
            undefined
            : false;
    }

    changeVehicleDisponible(value, vehicle) {

        let vehicleChange: any;

        let indexSustituir = this.ownVehicles.findIndex(x => +x.id === +vehicle.id);

        vehicleChange = this.availableVehicles.find(x => x.id == value);

        console.log(vehicleChange, 'vehicleChange');

        this.ownVehicles[indexSustituir] = vehicleChange;

        console.log(this.ownVehicles, 'this.ownVehicles');

        // TODO: debes agregar un action que emule la eliminacion de ese vehiculo (el anterior) y adicional que emule el de agregar el nuevo.

        /* eliminar el vehiculo actual */

        this.stopUsingVehicle(vehicle.id);

        /* luego lo agrega desde 0 como hace el modal */

        this.facade.getZoneById(this.zoneId).pipe(take(1)).subscribe((zone) => {

            this.usersFacade.allUsersDrivers$.pipe(take(1)).subscribe((users) => {

                this.ownVehicles.forEach(element => {

                    console.log(element, 'element');

                    let user = users.find(x => x.id == element.userId);

                    console.log(user, 'user');

                    this.facade.useVehicle(this.zoneId, this.ownVehicles, (user && user.userTypeId == 2 ? false : zone.evaluated));

                    this.loadFeeCostDriver(element.userId, element.id, true);
                })
            });



        });

    }

    async getVehicle() {

        const preferences = await this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).toPromise();

        this.vehiclesInUse = [];

        combineLatest(

            this.vehicleFacade.allVehicles$,

            this.facade.planningSessionVehicles$,
        )
            .pipe(take(1))

            .subscribe((combinedObservables: [Vehicle[], {}]) => {


                if (combinedObservables[0] && combinedObservables[1]) {


                    this.vehiclesInUse = [];


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

                    this.availableVehicles = [];

                    for (let vehicle of this.ownVehicles) {
                        this.availableVehicles.push(vehicle);
                    }

                    for (let vehicle of vehicles) {

                        if (!this.findVehicle(vehicle.id, combinedObservables[1])) {

                            this.availableVehicles.push(vehicle);
                        }

                    }

                    this.detectChange.detectChanges();

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

    showDisponibles(vehicles, enables) {
        console.log(this.vehiclesInUse, 'vehiclesInUse');

        console.log(this.availableVehicles, 'availableVehicles');
    }
}
