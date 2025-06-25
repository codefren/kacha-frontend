import { ModalConfirmDocumentComponent } from './../../../../../../shared/src/lib/components/modal-confirm-document/modal-confirm-document.component';
import { ModalDocumentComponent } from './../../../../../../shared/src/lib/components/modal-document/modal-document.component';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { Vehicle } from '../../../../../../backend/src/lib/types/vehicles.type';
import { NgbDateStruct, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    dateToObject,
    getToday,
    objectToString,
} from '../../../../../../shared/src/lib/util-functions/date-format';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { OptimizationPreferences } from '../../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../../state-preferences/src/lib/+state/preferences.facade';
import { VehiclesFacade } from '../../../../../../state-vehicles/src/lib/+state/vehicles.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import {
    secondsToDayTimeAsString,
    dayTimeAsStringToSeconds,
} from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { VehiclesMessages } from '../../../../../../shared/src/lib/messages/vehicles/vehicles.message';
import { StateUsersService } from '../../../../../../state-users/src/lib/state-users.service';
import { take, takeUntil } from 'rxjs/operators';
import { StateUsersFacade } from '../../../../../../state-users/src/lib/+state/state-users.facade';
import { User } from '../../../../../../backend/src/lib/types/user.type';
import { Zone } from '../../../../../../backend/src/lib/types/delivery-zones.type';
import { DeliveryZones } from '../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.reducer';
import { StateEasyrouteFacade } from '../../../../../../state-easyroute/src/lib/+state/state-easyroute.facade';
import { StateDeliveryZonesFacade } from '../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { TranslateService } from '@ngx-translate/core';
import { sliceMediaString } from '../../../../../../shared/src/lib/util-functions/string-format';
declare function init_plugins();
declare var $: any;
import * as moment from 'moment';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { LoadingService } from '@optimroute/shared';
import { Profile } from '../../../../../../backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from '../../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';

@Component({
    selector: 'easyroute-management-form-vehicles',
    templateUrl: './management-form-vehicles.component.html',
    styleUrls: ['./management-form-vehicles.component.scss'],
})
export class ManagementFormVehiclesComponent implements OnInit, OnDestroy {

    optimizationPreferences$: Observable<OptimizationPreferences>;

    unsubscribe$ = new Subject<void>();

    createVehicleFormGroup: FormGroup;

    vehicles_messages: any;

    zones: Observable<Zone[]>;

    zones$: Observable<DeliveryZones>;

    vehiclesType: any[] = [];

    data: any;

    vehicles: Vehicle;

    vehiclesOut: Vehicle;

    dateNow: NgbDateStruct = dateToObject(getToday());

    startDateSeleccionado: NgbDate;

    dateFormate: any;

    dischargingMinutes: number;

    dischargingMinutesChanged = false;

    dischargingSeconds: number;

    dischargingSecondsChanged = false;

    deliveryWIndowsStart: string = 'deliveryWIndowsStart';

    deliveryWIndowsEnd: string = 'deliveryWIndowsEnd';

    initialTime: string;

    _initialTime: string;

    finalTime: string;

    _finalTime: string;
    //users: Observable<User[]>;
    users: any[] = [];

    vehicleServiceType: any;

    BreakTime: any;

    titleTranslate: string = 'VEHICLES.ADD_VEHICLE';

    vehicleStopTypes: any = [];

    showServiceType: boolean = true;

    loadingSchedule: boolean = false;

    type: any[] = [];

    companyTimeZone: any[] = [];

    error: boolean = false;

    copyScheduleDay: any;

    libre: boolean;

    timeZone: any[] = [];

    load: 'loading' | 'success' | 'error' = 'loading';

    select: string ='generic_information';

    change = {
       
        generic_information:'generic_information',
        assignments:'assignments',
        documentation:'documentation',
        maintenance:'maintenance',
        costs:"costs"
        
    };

    idParan: any;

    imageError: string = '';

    imgLoad: string ='';

    activeVehicles: boolean = true;
    
    profile: Profile;

    redirect: any;
    

    constructor(
        private facade: PreferencesFacade,
        public facadeProfile: ProfileSettingsFacade,
        private toastService: ToastService,
        private translate: TranslateService,
        private vehiclesFacade: VehiclesFacade,
        private easyRouteFacade: StateEasyrouteFacade,
        private usersFacade: StateUsersFacade,
        private _activatedRoute: ActivatedRoute,
        private backendService: BackendService,
        private zoneFacade: StateDeliveryZonesFacade,
        private service: StateUsersService,
        public authLocal: AuthLocalService,
        private router: Router,
        private fb: FormBuilder,
        private dialog: NgbModal,
        private detectChange: ChangeDetectorRef,
        private stateEasyrouteService: StateEasyrouteService,
        private loading: LoadingService,
    ) {}

    ngOnInit() {
        this.easyRouteFacade.isAuthenticated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((isAuthenticated: boolean) => {
                if (isAuthenticated) {
                    this.zoneFacade.loadAll();
                }
            });

        this.zones$ = this.zoneFacade.state$;

        this.zones$.pipe(takeUntil(this.unsubscribe$)).subscribe((zoneState) => {
            if (zoneState.loaded) {
                this.zones = this.zoneFacade.allDeliveryZones$;
            }
        });

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {

                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {

                        this.profile = data;
                    });
            }
        });

        this.validateRoute();

        this.getVehicleType();

       
    }

    getVehicleType() {
        this.service
            .loadVehiclesType()
            .pipe(take(1))
            .subscribe((data) => {
                this.vehiclesType = data.data;
            });
    }

  

    validateRoute() {

        this._activatedRoute.params.subscribe(({ id }) => {

            this.idParan = id;

            if (id === 'new') {

                this.vehicles = new Vehicle();

                this.initForm(new Vehicle());

            } else {

                this.getUrl();

                this.titleTranslate = 'VEHICLES.EDIT_VEHICLE';

                this.backendService.get(`vehicle/${id}`).subscribe(

                    ({ data }) => {

                        this.vehicles = data;

                        this.vehiclesOut = data;

                        this.vehicles.vehicleStopType = data.vehicleStopType;

                        this.activeVehicles = this.vehicles.isActive;

                        this.imgLoad = this.vehicles.urlImage;

                        console.log(this.imgLoad, 'this.imgLoad')

                        if (this.vehicles) {

                            /* if (this.vehicles.nextVehicleInspection !== null) {

                                this.vehicles.nextVehicleInspection = dateToObject(

                                    this.vehicles.nextVehicleInspection,

                                );
                            } */

                            this.initForm(this.vehicles);
                           
                        }
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
            }
        });
    }

    getUrl(){
        this._activatedRoute.params.subscribe((params) => {
    
            this.idParan = params['id'];
    
            this.redirect = params['redirect'];

            if (this.idParan  &&  this.redirect){
        
               switch (this.redirect) {
        
                case 'maintenance':
        
                  this.select ='maintenance';
        
                  break;
               
                default:
                  this.select = this.change['generic_information'];
                  break;
               }
            }

            this.detectChange.detectChanges();

        });
    }

    initForm(data: Vehicle) {
        if (data.id > 0 && data.vehicleStopType.length > 0) {
            if (data.vehicleStopType[0].stopTypeId == 1) {
                data.vehicleStopType[0].amount = data.vehicleStopType[0].amount / 1000;
                data.vehicleStopType[0].restAmount = secondsToDayTimeAsString(
                    data.vehicleStopType[0].restAmount.toString(),
                );
            } else {
                data.vehicleStopType[0].amount = secondsToDayTimeAsString(
                    data.vehicleStopType[0].amount.toString(),
                );
                data.vehicleStopType[0].restAmount = secondsToDayTimeAsString(
                    data.vehicleStopType[0].restAmount.toString(),
                );
            }
        }

        let starttotalSeconds = +data.deliveryWindowStart ? data.deliveryWindowStart : 0;
        starttotalSeconds %= 3600;
        let startminutes = Math.floor(starttotalSeconds / 60);
        let startseconds = starttotalSeconds % 60;

        let endtotalSeconds = +data.deliveryWindowEnd ? data.deliveryWindowEnd : 0;
        let endhours = Math.floor(endtotalSeconds / 3600);
        endtotalSeconds %= 3600;
        let endminutes = Math.floor(endtotalSeconds / 60);
        let endseconds = endtotalSeconds % 60;
        this.createVehicleFormGroup = this.fb.group({
            id: [data.id],
            name: [
                data.name,
                [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
            ],
            vehicleType: [data.vehicleType ? data.vehicleType.id : 0],
            deliveryZoneId: [data.deliveryZoneId == null ? '' : data.deliveryZoneId],
            capacity: [data.capacity, [Validators.minLength(0), Validators.maxLength(50)]],
            registration: [
                data.registration,
                [Validators.minLength(2), Validators.maxLength(10)],
            ],
            weightLimit: [
                data.weightLimit,
                [Validators.minLength(0), Validators.maxLength(50)],
            ],
            nextVehicleInspection: [data.nextVehicleInspection],
            userId: [data.userId ? data.userId : '', [Validators.required]],
            deliveryWindowEnd: [
                data.deliveryWindowEnd
                    ? secondsToDayTimeAsString(data.deliveryWindowEnd)
                    : secondsToDayTimeAsString(86399),
            ],
            deliveryWindowStart: [
                data.deliveryWindowStart
                    ? secondsToDayTimeAsString(data.deliveryWindowStart)
                    : secondsToDayTimeAsString(0),
            ],
            vehicleServiceType: this.fb.array([]),
            accessories: [
                data.accessories,
                [Validators.minLength(2), Validators.maxLength(1000)],
            ],
            deliveryLimit: [data.deliveryLimit],
            stopRequired: [data.stopRequired],
            vehicleStopType: this.fb.group({
                stopTypeId: [
                    data.vehicleStopType &&
                    data.vehicleStopType[0] &&
                    data.vehicleStopType[0].stopTypeId
                        ? data.vehicleStopType &&
                          data.vehicleStopType[0] &&
                          data.vehicleStopType[0].stopTypeId
                        : '',
                    [Validators.required],
                ],
                amount: [
                    data.vehicleStopType &&
                        data.vehicleStopType[0] &&
                        data.vehicleStopType[0].amount,
                ],
                restAmount: [
                    data.vehicleStopType &&
                        data.vehicleStopType[0] &&
                        data.vehicleStopType[0].restAmount,
                ],
            }),
            activateDeliverySchedule: [data.activateDeliverySchedule],
            activeScheduleMonday: [
                data.schedule &&
                data.schedule.days &&
                data.schedule.days.find((x) => x.intDay === 1)
                    ? true
                    : false,
            ],
            activeScheduleTuesday: [
                data.schedule &&
                data.schedule.days &&
                data.schedule.days.find((x) => x.intDay === 2)
                    ? true
                    : false,
            ],
            activeScheduleWednesday: [
                data.schedule &&
                data.schedule.days &&
                data.schedule.days.find((x) => x.intDay === 3)
                    ? true
                    : false,
            ],
            activeScheduleThursday: [
                data.schedule &&
                data.schedule.days &&
                data.schedule.days.find((x) => x.intDay === 4)
                    ? true
                    : false,
            ],
            activeScheduleFriday: [
                data.schedule &&
                data.schedule.days &&
                data.schedule.days.find((x) => x.intDay === 5)
                    ? true
                    : false,
            ],
            activeScheduleSaturday: [
                data.schedule &&
                data.schedule.days &&
                data.schedule.days.find((x) => x.intDay === 6)
                    ? true
                    : false,
            ],
            activeScheduleSunday: [
                data.schedule &&
                data.schedule.days &&
                data.schedule.days.find((x) => x.intDay === 7)
                    ? true
                    : false,
            ],
            deliveryPointScheduleTypeId: [
                data.deliveryPointScheduleTypeId ? data.deliveryPointScheduleTypeId : 1,
            ],
            schedule: [],
            scheduleSpecification: [],
            free: [],
            isActive: [data.isActive],
        });

        this.createVehicleFormGroup.get('id').disable();

        if(!data.stopRequired) {
            (<FormGroup>(this.createVehicleFormGroup.get('vehicleStopType'))).get('stopTypeId').setValidators([]);
            (<FormGroup>(this.createVehicleFormGroup.get('vehicleStopType'))).get('stopTypeId').updateValueAndValidity();
        }
       

       

        if (data.id > 0 && data.vehicleStopType.length > 0) {
            if (data.vehicleStopType[0].stopTypeId == 1) {
                this.createVehicleFormGroup
                    .get('vehicleStopType.amount')
                    .setValidators([Validators.min(1), Validators.max(99999)]);
            }
        }
        /* if (this.createVehicleFormGroup.value.activateDeliverySchedule) {

            this.getScheduleSpecification();
        }  */

        

        let vehicles_messages = new VehiclesMessages();
        this.vehicles_messages = vehicles_messages.getVehiclesMessages();
        this.getServiceTypeVehicle();
       
    }



  


    /* enviar al api btn */
    submit() {
        const formValues = this.createVehicleFormGroup.value;

        //eliminar input chebox temporales

        delete formValues.activeScheduleMonday;
        delete formValues.activeScheduleTuesday;
        delete formValues.activeScheduleWednesday;
        delete formValues.activeScheduleThursday;
        delete formValues.activeScheduleFriday;
        delete formValues.activeScheduleSaturday;
        delete formValues.activeScheduleSunday;

        delete formValues.free;

        this.createVehicleFormGroup.controls['nextVehicleInspection'].setValue(
            objectToString(
                this.createVehicleFormGroup.controls['nextVehicleInspection'].value,
            ),
        );

        this.createVehicleFormGroup
            .get('deliveryWindowStart')
            .setValue(
                dayTimeAsStringToSeconds(
                    this.createVehicleFormGroup.value.deliveryWindowStart,
                ),
            );

        this.createVehicleFormGroup
            .get('deliveryWindowEnd')
            .setValue(
                dayTimeAsStringToSeconds(
                    this.createVehicleFormGroup.value.deliveryWindowEnd,
                ),
            );

        if (this.createVehicleFormGroup.value.vehicleStopType.stopTypeId == 1) {
            formValues.vehicleStopType.amount =
                this.createVehicleFormGroup.value.vehicleStopType.amount * 1000;
            formValues.vehicleStopType.restAmount = dayTimeAsStringToSeconds(
                this.createVehicleFormGroup.value.vehicleStopType.restAmount,
            );
            this.vehicleStopTypes.push({
                stopTypeId: +this.createVehicleFormGroup.value.vehicleStopType.stopTypeId,
                amount: this.createVehicleFormGroup.value.vehicleStopType.amount
                    ? this.createVehicleFormGroup.value.vehicleStopType.amount
                    : 0,
                restAmount: this.createVehicleFormGroup.value.vehicleStopType.restAmount
                    ? this.createVehicleFormGroup.value.vehicleStopType.restAmount
                    : 0,
            });
        } else if (this.createVehicleFormGroup.value.vehicleStopType.stopTypeId == 2) {
            formValues.vehicleStopType.amount = dayTimeAsStringToSeconds(
                this.createVehicleFormGroup.value.vehicleStopType.amount,
            );
            formValues.vehicleStopType.restAmount = dayTimeAsStringToSeconds(
                this.createVehicleFormGroup.value.vehicleStopType.restAmount,
            );
            this.vehicleStopTypes.push({
                stopTypeId: +this.createVehicleFormGroup.value.vehicleStopType.stopTypeId,
                amount: this.createVehicleFormGroup.value.vehicleStopType.amount
                    ? this.createVehicleFormGroup.value.vehicleStopType.amount
                    : 0,
                restAmount: this.createVehicleFormGroup.value.vehicleStopType.restAmount
                    ? this.createVehicleFormGroup.value.vehicleStopType.restAmount
                    : 0,
            });
        } else {
            this.vehicleStopTypes = [];
        }

        // Cargando los horarios
        if (
            this.vehicles.id === 0 &&
            this.vehicles.schedule &&
            this.vehicles.schedule.days &&
            this.vehicles.schedule.days.length > 0 &&
            this.createVehicleFormGroup.value.activateDeliverySchedule
        ) {
            this.vehicles.schedule.days.forEach((day) => {
                let hours = day.hours.filter((x) => x.timeStart >= 0 && x.timeEnd >= 0);

                day = {
                    ...day,
                    hours: hours,
                };
            });

            /* scheduel */
            if (formValues.deliveryPointScheduleTypeId == 1) {
                formValues.schedule = {
                    days: this.vehicles.schedule.days.filter((x) => x.isActive === true),
                };

                delete formValues.scheduleSpecification;
            } else {
                formValues.scheduleSpecification = {
                    timeZone: this.gettimeZoneVAlue(),
                };

                delete formValues.schedule;
            }
        }

        if (!this.createVehicleFormGroup.value.activateDeliverySchedule) {
            formValues.schedule = [];
            formValues.scheduleSpecification = [];
            formValues.deliveryPointScheduleTypeId = null;
        }

        if (!this.vehicles || !this.vehicles.id || this.vehicles.id === null) {
            let vehicle = this.confirmAddition(this.createVehicleFormGroup);

            vehicle['schedule'] = formValues.schedule ? formValues.schedule : null;
            vehicle['scheduleSpecification'] = formValues.scheduleSpecification
                ? formValues.scheduleSpecification
                : null;
            if (!this.createVehicleFormGroup.value.activateDeliverySchedule) {
                formValues.schedule = [];
                formValues.scheduleSpecification = [];
                vehicle['deliveryPointScheduleTypeId'] = formValues.activateDeliverySchedule
                    ? formValues.deliveryPointScheduleTypeId
                    : null;
            }

            
            this.addVehicle(vehicle);
            this.vehiclesFacade.added$.pipe(take(2)).subscribe((data) => {
                if (data) {
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.REGISTRATION'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.router.navigate(['management-logistics/vehicles']);
                }
            });
        } else {
            delete formValues.schedule;
            delete formValues.scheduleSpecification;

            let vehicle = this.confirmAddition(this.createVehicleFormGroup);
            if (!this.createVehicleFormGroup.value.activateDeliverySchedule) {
                vehicle['deliveryPointScheduleTypeId'] = formValues.activateDeliverySchedule
                    ? formValues.deliveryPointScheduleTypeId
                    : null;
            }
            this.vehiclesFacade.editVehicle(this.vehicles.id, vehicle);

            this.vehiclesFacade.updated$.pipe(take(2)).subscribe((data) => {
                if (data) {
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.router.navigate(['management-logistics/vehicles']);
                }
            });
        }
    }
    gettimeZoneVAlue() {
        let selectedTimeZoneIds: any;
        if (this.companyTimeZone && this.companyTimeZone.length > 0) {
            selectedTimeZoneIds = this.vehicles.timeZone
                .map((v, i) => (v ? v.companyTimeZoneId : null))
                .filter((v) => v !== null);
        }
        return selectedTimeZoneIds;
    }

    confirmAddition(form): Vehicle {
        let deliveryZoneId = form.get('deliveryZoneId').value;
        let datos: Vehicle = {
            name: form.get('name').value,
            deliveryZoneId: deliveryZoneId.length === 0 ? null : deliveryZoneId,
            activateDeliverySchedule: form.get('activateDeliverySchedule').value
                ? form.get('activateDeliverySchedule').value
                : false,
            capacity: +form.get('capacity').value,
            weightLimit: form.get('weightLimit').value
                ? +form.get('weightLimit').value
                : null,
            registration: form.get('registration').value
                ? form.get('registration').value
                : null,
            nextVehicleInspection: form.get('nextVehicleInspection').value
                ? form.get('nextVehicleInspection').value
                : null,
            userId:
                form.get('userId').value == 'null' || form.get('userId').value === 0
                    ? null
                    : form.get('userId').value,
            vehicleTypeId:
                form.get('vehicleType').value == 0 ? null : form.get('vehicleType').value,
            deliveryWindowEnd:
                form.get('deliveryWindowEnd').value > 0
                    ? form.get('deliveryWindowEnd').value
                    : 86399,
            deliveryWindowStart:
                form.get('deliveryWindowStart').value > 0
                    ? form.get('deliveryWindowStart').value
                    : 0,
            vehicleServiceType: this.getFilterVAlue(),
            accessories: form.get('accessories').value
                ? form.get('accessories').value
                : null,
            deliveryLimit: form.get('deliveryLimit').value
                ? form.get('deliveryLimit').value
                : null,
            stopRequired: form.get('stopRequired').value
                ? form.get('stopRequired').value
                : false,
            vehicleStopType: this.vehicleStopTypes,
            deliveryPointScheduleTypeId: form.get('deliveryPointScheduleTypeId').value
                ? form.get('deliveryPointScheduleTypeId').value
                : null,
            isActive: form.get('isActive').value ? form.get('isActive').value : false,
        };

        return datos;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    addVehicle(vehicle: Vehicle) {
        this.vehiclesFacade.addVehicle(vehicle);
    }

    editVehicle(obj: [number, Partial<Vehicle>]) {
        this.vehiclesFacade.editVehicle(obj[0], obj[1]);
    }
    redirectUsersList() {
        this.router.navigateByUrl('management/users');
    }

    getServiceTypeVehicle() {
        this.showServiceType = false;

        this.service.loadVehiclesServiceType().subscribe(({ data }) => {
            this.showServiceType = true;

            this.vehicleServiceType = data;

            

            this.addFilter();
        });
    }

    /* funcion de agregar filtros */
    addFilter() {
        this.vehicleServiceType.map((o, i) => {
            let control: FormControl;
            if (this.vehicles.vehicleServiceType.length > 0) {
                control = new FormControl(
                    this.vehicles.vehicleServiceType.find((x) => x.id === o.id) !=
                        undefined,
                );
            } else {
                control = new FormControl(false);
            }
            (this.createVehicleFormGroup.controls.vehicleServiceType as FormArray).push(
                control,
            );
        });
    }

 
   

    getFilterVAlue() {
        let selectedFilterIds: any;

        if (this.vehicleServiceType && this.vehicleServiceType.length > 0) {
            selectedFilterIds = this.createVehicleFormGroup.value.vehicleServiceType
                .map((v, i) => (v ? this.vehicleServiceType[i].id : null))
                .filter((v) => v !== null);
        }

        return selectedFilterIds;
    }


    openServiceType() {
        this.router.navigateByUrl('management-logistics/vehicles/servies-type');
    }

    returnsList(){

        if (this.redirect == 'maintenance') {

            this.router.navigate(['notifications']);
            
        } else {

            this.router.navigate(['management-logistics/vehicles']);

        }
    }

    changePage(name: string) {
        
        this.select = this.change[name];
    
        this.detectChange.detectChanges();
      }

      returnsDate(date:any){
        if (date) {
            return moment(date).format('DD/MM/YYYY')
        } else {
            return '00/00/0000'
        }
      
      }

      fileChangeEvent($event: any) {
   
        return this.loadImage64($event);
      }

      loadImage64(e: any) {
    
        this.imageError = '';
      
        const allowedTypes = ['image/jpeg', 'image/png'];
    
        const reader = new FileReader();
    
        const maxSize = 1000000;
    
      
        let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      
        if (file.size > maxSize) {
            this.imageError = 'Tamaño máximo permitido ' + '('+maxSize / 1000 / 1000 + 'Mb' +')';
            return;
        }
      
        if (!allowedTypes.includes(file.type)) {
            this.imageError = 'Formatos permitidos ( JPG | PNG )';
            return;
        }
      
    
        reader.onload = this.validateSizeImg.bind( this );
    
      
        reader.readAsDataURL( file );
    
        $("input[type='file']").val('');
        
      }

      validateSizeImg( $event) {

        const reader = $event.target.result;

        this._handleUpdateImage(reader);
      
      
        return reader;
      }

      _handleUpdateImage(image: any) {


        delete image.urlImage;
    
        if (this.vehicles && this.vehicles.id && this.vehicles.id >0) {


            this.loading.showLoading();

            // crea la imagen de la compañia

            this.backendService.put(`vehicle_update_image/${ this.vehicles.id }`,{ image:image }).pipe(take(1)).subscribe(
                ({ data }) => {


                    this.imgLoad = image;


                    this.toastService.displayWebsiteRelatedToast(

                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

                        this.translate.instant('GENERAL.ACCEPT'),

                    );
        
                   
                    this.loading.hideLoading();

                    this.detectChange.detectChanges();
                },
                (error) => {
                    
                    this.loading.hideLoading();

                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
           
        } else {
           
            this.imgLoad = image;

            this.detectChange.detectChanges();
        }
    }
    
    _handleDeleteImage() {

        
    
      if (this.vehicles && this.vehicles.id >0) {

        this.loading.showLoading();
    
           this.backendService.put(`vehicle_delete_image/${ this.vehicles.id }`).pipe(take(1))
              .subscribe(
                  (resp) => {
                    
                    this.imgLoad = '';

                    $("input[type='file']").val('');

                      this.toastService.displayWebsiteRelatedToast(
                          this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                          this.translate.instant('GENERAL.ACCEPT'),
                      );

                      this.loading.hideLoading();
                     
                      this.detectChange.detectChanges();
                  },
                  (error) => {

                    this.loading.hideLoading();

                    this.toastService.displayHTTPErrorToast(error.error);
                  },
              );
      } else {
        
        this.imgLoad ='';

        this.detectChange.detectChanges();

        
      }
    }

    changeActive(event: any){
        
        this.activeVehicles = event;

        this.vehicles.isActive = event;

        this.createVehicleFormGroup.get('isActive').setValue(event);

        this.createVehicleFormGroup.get('isActive').updateValueAndValidity();

        let vehicle = this.confirmAddition(this.createVehicleFormGroup);

        

        if (this.vehicles && this.vehicles.id >0) {
           
            this.vehiclesFacade.editVehicle(this.vehicles.id, vehicle);
        }
    }

    ModuleCost(){

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

    showNotTraffic(){
        return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role != 16) !==
        undefined
        : false;
    }

    vehicleMaintenanceActive() {
        
        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 8)) {
            return true;
        } else {
            return false;
        }
    }

    getData(data: any){

    
        this.vehicles = data;
    
      }
    

     
}
