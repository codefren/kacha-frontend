import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { take } from 'rxjs/operators';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Vehicle } from '../../../../../../../backend/src/lib/types/vehicles.type';
import { dateToObject, objectToString } from '../../../../../../../shared/src/lib/util-functions/date-format';
import { secondsToDayTimeAsString, dayTimeAsStringToSeconds } from '../../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { VehiclesMessages } from '../../../../../../../shared/src/lib/messages/vehicles/vehicles.message';
import { TranslateService } from '@ngx-translate/core';
import { StateUsersService } from '../../../../../../../state-users/src/lib/state-users.service';
import { VehiclesFacade } from '../../../../../../../state-vehicles/src/lib/+state/vehicles.facade';
import { Router } from '@angular/router';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { LoadingService } from '@optimroute/shared';
declare var $: any;
@Component({
  selector: 'easyroute-generic-information',
  templateUrl: './generic-information.component.html',
  styleUrls: ['./generic-information.component.scss']
})
export class GenericInformationComponent implements OnInit , OnChanges{

  loadingSchedule: boolean = false;

  type: any[] = [];

  vehicles: Vehicle;


  createVehicleFormGroup: FormGroup;

  @Input() idParan: any;

  @Input() activeVehicles: any;

  @Input() imgLoad: any;

  vehicles_messages: any;

  companyTimeZone: any[] = [];

  timeZone: any[] = [];

  error: boolean = false;

  vehiclesType: any[] = [];

  load: 'loading' | 'success' | 'error' = 'loading';

  users: any[] = []; 

  vehicleStopTypes: any = [];

  showServiceType: boolean = true;

  vehicleServiceType: any;

  licenseList: any [] = [];

  loadList: 'loading' | 'success' | 'error' = 'loading';

  totalVolument: number =0;

  liftGateSelect :boolean = false;

  liftGateSelectTrue :boolean = true;

  numRegex = /^-?\d*[.,]?\d{0,2}$/;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: StateUsersService,
    private translate: TranslateService,
    private backendService: BackendService,
    private detectChange: ChangeDetectorRef,
    private vehiclesFacade: VehiclesFacade,
    private toastService: ToastService,
    private loading: LoadingService,
    private stateEasyrouteService: StateEasyrouteService,
  ) { }

    ngOnInit() { }
    
    ngOnChanges() {

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
        
            if (this.idParan === 'new') {

                this.vehicles = new Vehicle();

                this.vehicles.isActive = this.activeVehicles;

                this.vehicles.urlImage = this.imgLoad;
                
                this.initForm( this.vehicles);

                this.getUsers();

            } else {
    
                this.backendService.get(`vehicle/${this.idParan}`).subscribe(
                    ({ data }) => {
                        this.vehicles = data;
    
                        
                        this.vehicles.vehicleStopType = data.vehicleStopType;
    
                        if (this.vehicles) {
                          

                            this.getUsers();
    
                            this.initForm(this.vehicles);
                            try {
                                this.detectChange.detectChanges();
    
                              //  this.cargarDocument();
                            } catch (e) {}
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
        
    }

    getUsers() {

        this.load = 'loading';
    
        setTimeout(() => {
         
            this.stateEasyrouteService.getDriver(this.vehicles.userId).subscribe(
                (data: any) => {
                    this.users = data.data;
    
                    
    
                    this.load = 'success';

                    this.getLicense();
                    this.detectChange.detectChanges();
                    this.loading.hideLoading();
                },
                (error) => {
                    this.load = 'error';
                    this.loading.hideLoading();
    
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }, 500);
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
            vehicleType: [data.vehicleType ? data.vehicleType.id : ''],
            deliveryZoneId: [data.deliveryZoneId == null ? '' : data.deliveryZoneId],
            capacity: [data.capacity, [Validators.minLength(0), Validators.pattern('^[0-9]*$')]],
            registration: [
                data.registration,
                [Validators.minLength(2), Validators.maxLength(10)],
            ],
            weightLimit: [
                data.weightLimit,
                [Validators.min(0), Validators.pattern('^[0-9]*$')],
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
                    [],
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

            vehicleBrand:[ data.vehicleBrand ,[Validators.maxLength(50)]],

            model:[ data.model ,[Validators.maxLength(50)]],

            frameNumber:[ data.frameNumber ,[ Validators.max(50)]],

            acquisitionDate:[data.acquisitionDate],

            lowDate:[data.lowDate],

            licenseId:[data.licenseId ? data.licenseId : ''],

            tare:[data.tare, [Validators.pattern(/^\d+(\.\d{1,3})?$/)]],

            mma:[data.mma, [Validators.pattern(/^\d+(\.\d{1,3})?$/)]],

            usefulLoad:[data.usefulLoad, [Validators.pattern('^[0-9]*$')]],

            liftGate:[data.liftGate ? true : false],

            length:[data.length.toFixed(2), [Validators.pattern(this.numRegex)]],

            width:[data.width.toFixed(2), [Validators.pattern(this.numRegex)]],

            tall:[data.tall.toFixed(2), [Validators.pattern(this.numRegex)]],

            totalVolumetricCapacity:[data.totalVolumetricCapacity.toFixed(2), [Validators.pattern(this.numRegex)]],

            schedule: [],

            scheduleSpecification: [],

            free: [],

            isActive: [data.isActive],

            image:[data.urlImage],

            idERP: [data.idERP]


        });
    
        this.createVehicleFormGroup.get('id').disable();
    
        if(!data.stopRequired) {
            (<FormGroup>(this.createVehicleFormGroup.get('vehicleStopType'))).get('stopTypeId').setValidators([]);
            (<FormGroup>(this.createVehicleFormGroup.get('vehicleStopType'))).get('stopTypeId').updateValueAndValidity();
        }
        this.createVehicleFormGroup.controls['deliveryWindowStart'].setValidators([
            this.ValidatorWindowsStart.bind(this.createVehicleFormGroup),
        ]);
    
        this.createVehicleFormGroup.controls['deliveryWindowEnd'].setValidators([
            this.ValidatorWindowsEnd.bind(this.createVehicleFormGroup),
        ]);
    
        if (data.id > 0 && data.vehicleStopType.length > 0) {
            if (data.vehicleStopType[0].stopTypeId == 1) {
                this.createVehicleFormGroup
                    .get('vehicleStopType.amount')
                    .setValidators([Validators.min(1), Validators.max(99999)]);
            }
        }
       
    
        if (this.createVehicleFormGroup.value.deliveryPointScheduleTypeId == 1) {
            console.log('if llamar getDeliveryPointSchedule');
            this.getDeliveryPointSchedule();
        } else if (this.createVehicleFormGroup.value.deliveryPointScheduleTypeId == 2) {
            this.getScheduleSpecification();
        }

       
    
        let vehicles_messages = new VehiclesMessages();
        this.vehicles_messages = vehicles_messages.getVehiclesMessages();
        
        this.getDeliveryPointType();
        this.getServiceTypeVehicle();
        this.getCompanyTimeZone();

        /* if (data.id > 0) {

            this.totalVoluments();
            
        } */
    }

    getLicense(){

        this.loadList = 'loading';
            
        this.backendService.get(`license_all`).subscribe(
            ({ data }) => {

               this.loadList = 'success';

               this.licenseList = data;
               
            },
            (error) => {

                this.loadList = 'error';

                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }

    getCompanyTimeZone() {
        this.backendService
            .get('company_time_zone')
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.companyTimeZone = response.data;
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(error.error.code, error.error);
                    this.detectChange.detectChanges();
                },
            );
    }


    ValidatorWindowsStart(control: FormControl): { [s: string]: boolean } {
        let formulario: any = this;
        if (control.value === formulario.controls['deliveryWindowEnd'].value) {
            return {
                confirmar: true,
            };
        } else if (control.value > formulario.controls['deliveryWindowEnd'].value) {
            return {
                sutrast: true,
            };
        }
        return null;
    }

    ValidatorWindowsEnd(control: FormControl): { [s: string]: boolean } {
        let formulario: any = this;
        if (control.value < formulario.controls['deliveryWindowStart'].value) {
            return {
                sutrast: true,
            };
        } else if (control.value === formulario.controls['deliveryWindowStart'].value) {
            return {
                confirmar: true,
            };
        }
        return null;
    }
    changetime(event: any, name: string) {
        if (event.target.value === '') {
            switch (name) {
                case 'deliveryWIndowsStart':
                    this.createVehicleFormGroup
                        .get('deliveryWindowStart')
                        .setValue(secondsToDayTimeAsString(0));
                    this.createVehicleFormGroup
                        .get('deliveryWindowStart')
                        .updateValueAndValidity();
                    break;
                case 'deliveryWIndowsEnd':
                    this.createVehicleFormGroup
                        .get('deliveryWindowEnd')
                        .setValue(secondsToDayTimeAsString(86399));
                    this.createVehicleFormGroup
                        .get('deliveryWindowEnd')
                        .updateValueAndValidity();
                    break;
                default:
                    break;
            }
        } else {
            this.createVehicleFormGroup.get('deliveryWindowStart').updateValueAndValidity();
            this.createVehicleFormGroup.get('deliveryWindowEnd').updateValueAndValidity();
        }
    }

    /* change de radios eliveryPointScheduleTypeId */
    changedeliveryPointScheduleTypeId() {
        if (this.createVehicleFormGroup.value.deliveryPointScheduleTypeId == 1) {
            this.getDeliveryPointScheduleService();
        } else {
            this.getScheduleSpecificationService();
        }
    }
    /* llamar especificación de servicvios */
    
      getDeliveryPointType() {
        this.backendService
            .get('delivery_point_schedule_type')
            .pipe(take(1))
            .subscribe(
                (response) => {
                    this.loadingSchedule = true;
                    this.type = response.data;
                    
                    if (this.vehicles.id > 0) {
                        this.createVehicleFormGroup
                            .get('deliveryPointScheduleTypeId')
                            .setValue(
                                this.vehicles.deliveryPointScheduleTypeId
                                    ? this.vehicles.deliveryPointScheduleTypeId
                                    : this.type[0].id,
                            );
                        this.createVehicleFormGroup
                            .get('deliveryPointScheduleTypeId')
                            .updateValueAndValidity();
                        if (
                            this.createVehicleFormGroup.value.deliveryPointScheduleTypeId ==
                            1
                        ) {
                            this.getDeliveryPointScheduleService();
                            this.detectChange.detectChanges();
                        } else if (
                            this.createVehicleFormGroup.value.deliveryPointScheduleTypeId ==
                            2
                        ) {
                            this.getScheduleSpecificationService();
                            this.detectChange.detectChanges();
                        }
                    } else {
                        this.getDeliveryPointScheduleService();
                        this.getScheduleSpecificationService();
                    }
                    this.loadingSchedule = false;
    
                    this.detectChange.detectChanges();
                },
    
                (error) => {
                    this.loadingSchedule = false;
                    this.toastService.displayHTTPErrorToast(error.error.code, error.error);
                },
            );
    }

     // cargar aplicar por dia horario por dia cuando es editar y se eligue el radio
     getDeliveryPointScheduleService() {
      if (
          this.vehicles.id > 0 &&
          this.createVehicleFormGroup.value.activateDeliverySchedule
      ) {
          this.loadingSchedule = true;
          this.backendService
              .put('vehicle_schedule_day/vehicle/' + this.vehicles.id, {
                  deliveryPointScheduleTypeId: this.createVehicleFormGroup.value
                      .deliveryPointScheduleTypeId,
              })
              .pipe(take(1))
              .subscribe(
                  (datos) => {
                      this.vehicles.schedule = {
                          days: datos.data,
                      };
                      this.createVehicleFormGroup
                          .get('activeScheduleMonday')
                          .setValue(
                              this.vehicles.schedule &&
                                  this.vehicles.schedule.days &&
                                  this.vehicles.schedule.days.find(
                                      (x) => x.intDay === 1 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.createVehicleFormGroup
                          .get('activeScheduleTuesday')
                          .setValue(
                              this.vehicles.schedule &&
                                  this.vehicles.schedule.days &&
                                  this.vehicles.schedule.days.find(
                                      (x) => x.intDay === 2 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.createVehicleFormGroup
                          .get('activeScheduleWednesday')
                          .setValue(
                              this.vehicles.schedule &&
                                  this.vehicles.schedule.days &&
                                  this.vehicles.schedule.days.find(
                                      (x) => x.intDay === 3 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.createVehicleFormGroup
                          .get('activeScheduleThursday')
                          .setValue(
                              this.vehicles.schedule &&
                                  this.vehicles.schedule.days &&
                                  this.vehicles.schedule.days.find(
                                      (x) => x.intDay === 4 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.createVehicleFormGroup
                          .get('activeScheduleFriday')
                          .setValue(
                              this.vehicles.schedule &&
                                  this.vehicles.schedule.days &&
                                  this.vehicles.schedule.days.find(
                                      (x) => x.intDay === 5 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.createVehicleFormGroup
                          .get('activeScheduleSaturday')
                          .setValue(
                              this.vehicles.schedule &&
                                  this.vehicles.schedule.days &&
                                  this.vehicles.schedule.days.find(
                                      (x) => x.intDay === 6 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.createVehicleFormGroup
                          .get('activeScheduleSunday')
                          .setValue(
                              this.vehicles.schedule &&
                                  this.vehicles.schedule.days &&
                                  this.vehicles.schedule.days.find(
                                      (x) => x.intDay === 7 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
    
                      this.loadingSchedule = false;
    
                      this.detectChange.detectChanges();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.error.code,
                          error.error,
                      );
                  },
              );
      } else {
          if (
              this.vehicles.id === 0 &&
              (!this.vehicles.schedule ||
                  !this.vehicles.schedule.days ||
                  this.vehicles.schedule.days.length > 0)
          ) {
              this.vehicles.schedule = {
                  days: [
                      {
                          hours: [],
                          id: 0,
                          intDay: 1,
                          isActive: false,
                          fixedDelivery: false,
                      },
                  ],
              };
          }
      }
    }

     // cargar el formulario cuando es espesificación y se eleigue el radio
     getScheduleSpecificationService() {
      if (this.vehicles.id > 0) {
          this.loadingSchedule = true;
          this.backendService
              .put('vehicle_schedule_specification/vehicle/' + this.vehicles.id, {
                  activateDeliverySchedule: this.createVehicleFormGroup.value
                      .activateDeliverySchedule,
                  deliveryPointScheduleTypeId: this.createVehicleFormGroup.value
                      .deliveryPointScheduleTypeId,
              })
              .pipe(take(1))
              .subscribe(
                  (datos) => {
                      this.vehicles.timeZone = datos.data.timeZone;
    
                      this.loadingSchedule = false;
    
                      this.detectChange.detectChanges();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.error.code,
                          error.error,
                      );
                  },
              );
      } else {
          this.vehicles.schedule = {
              days: [
                  {
                      hours: [],
                      id: 0,
                      intDay: 1,
                  },
              ],
          };
          if (
              this.vehicles.id === 0 &&
              (!this.vehicles.schedule ||
                  !this.vehicles.schedule.days ||
                  this.vehicles.schedule.days.length > 0)
          ) {
              this.vehicles.schedule = {
                  days: [
                      {
                          hours: [],
                          id: 0,
                          intDay: 1,
                      },
                  ],
              };
          }
      }
    }


    getDeliveryPointSchedule() {
        if (this.vehicles.activateDeliverySchedule) {
            console.log('en el if getDeliveryPointSchedule');
            this.loadingSchedule = true;
            this.backendService
                .get('vehicle_schedule/' + this.vehicles.id)
                .pipe(take(1))
                .subscribe(
                    (datos) => {
                        this.vehicles.schedule = {
                            days: datos.data,
                        };
    
                        this.createVehicleFormGroup
                            .get('activeScheduleMonday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 1 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleTuesday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 2 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleWednesday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 3 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleThursday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 4 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleFriday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 5 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleSaturday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 6 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleSunday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 7 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
    
                        this.loadingSchedule = false;
    
                        this.detectChange.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                    },
                );
        } else {
            console.log('en el else getDeliveryPointSchedule');
            if (
                this.vehicles.id === 0 &&
                (!this.vehicles.schedule ||
                    !this.vehicles.schedule.days ||
                    this.vehicles.schedule.days.length === 0)
            ) {
                this.vehicles.schedule = {
                    days: [
                            {
                                hours: [],
                                id: 0,
                                intDay: 1,
                                isActive: false,
                                fixedDelivery: false,
                            },
                            {
                                hours: [],
                                id: 0,
                                intDay: 2,
                                isActive: false,
                                fixedDelivery: false,
                            },
                            {
                                hours: [],
                                id: 0,
                                intDay: 3,
                                isActive: false,
                                fixedDelivery: false,
                            },
                            {
                                hours: [],
                                id: 0,
                                intDay: 4,
                                isActive: false,
                                fixedDelivery: false,
                            },
                            {
                                hours: [],
                                id: 0,
                                intDay: 5,
                                isActive: false,
                                fixedDelivery: false,
                            },
                            {
                                hours: [],
                                id: 0,
                                intDay: 6,
                                isActive: false,
                                fixedDelivery: false,
                            },
                            {
                                hours: [],
                                id: 0,
                                intDay: 7,
                                isActive: false,
                                fixedDelivery: false,
                            },
                       
                    ],
                };
            }

         
        }

    }

     // cargar el formulario cuando es espesificación

     getScheduleSpecification() {
        if (this.vehicles.activateDeliverySchedule) {
            this.loadingSchedule = true;
    
            this.backendService
                .get('vehicle_schedule_specification/' + this.vehicles.id)
                .pipe(take(1))
                .subscribe(
                    (datos) => {
                        this.vehicles.timeZone = datos.data.timeZone;
    
                        this.loadingSchedule = false;
                        this.detectChange.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                    },
                );
        } else {
            
            if (
                this.vehicles.id === 0 &&
                (!this.vehicles.schedule ||
                    !this.vehicles.schedule.days ||
                    this.vehicles.schedule.days.length === 0)
            ) {
                
                this.vehicles.schedule = {
                    days: [
                        {
                            hours: [],
                            id: 0,
                            intDay: 1,
                        },
                    ],
                };
            }
        }
    }

    /* Aplicar horario por día */

    secondToTime(value) {
        return secondsToDayTimeAsString(value);
    }
    
    sortBy(prop: number) {
        return this.vehicles.schedule.days.filter((x) => x.intDay == prop);
    }
    
    validtimeStart(hours) {
        return hours.timeStart > hours.timeEnd || hours.timeStart === -1 ? true : false;
    }
    
    validtimeEnd(hours) {
        return hours.timeEnd < hours.timeStart || hours.timeEnd === -1 ? true : false;
    }

    /* validar hora */

    validIntervalHours(hour, day) {
        let index = day.hours.indexOf(hour);
        let exist = false;
        day.hours.forEach((element, i) => {
            if (index !== i && !exist) {
                exist =
                    element.timeStart <= hour.timeStart && element.timeEnd >= hour.timeStart
                        ? true
                        : false;
            }
        });
        return exist;
    }
    /* activar hora */

    changeScheduleDay(value, dayNumber, fixedDelivery) {
        let schedule = this.vehicles.schedule.days.find((x) => x.intDay == dayNumber);
    
        if (value) {
            if (this.vehicles.id > 0) {
                this.backendService
                    .put('vehicle_schedule_day/' + schedule.id, {
                        isActive: value,
                        // fixedDelivery: fixedDelivery,
                    })
                    .pipe(take(1))
                    .subscribe((response) => {
                        schedule.isActive = value;
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
    
                        this.detectChange.detectChanges();
                    });
            } else {
                if (schedule) {
                    
                    schedule.isActive = value;
                    schedule.fixedDelivery = fixedDelivery;
                    if (schedule.hours && schedule.hours.length == 0) {
                        /* schedule.hours.push({
                            timeStart: -1,
                            timeEnd: -1,
                            id: 0
                        }) */
                        schedule.hours = [];
                    }
                } else {
                   
                    this.vehicles.schedule.days.push({
                        intDay: dayNumber,
                        isActive: value,
                        fixedDelivery: fixedDelivery,
                        id: 0,
                        /* hours: [{
                            timeStart: -1,
                            timeEnd: -1,
                            id: 0
                        }] */
                        hours: [],
                    });
                }
    
                this.detectChange.detectChanges();
            }
        } else {
            if (this.vehicles.id > 0) {
                this.backendService
                    .put('vehicle_schedule_day/' + schedule.id, {
                        isActive: value,
                        fixedDelivery: fixedDelivery,
                    })
                    .pipe(take(1))
                    .subscribe((response) => {
                        schedule.isActive = value;
                        let data = schedule.hours.find(
                            (x) => x.timeEnd === -1 && x.timeEnd === -1,
                        );
                        const index = schedule.hours.indexOf(data);
                        if (data) {
                            schedule.hours.splice(index);
                        }
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        this.detectChange.detectChanges();
                    });
            } else {
                schedule.isActive = value;
                schedule.fixedDelivery = fixedDelivery;
                schedule.hours = [];
                this.detectChange.detectChanges();
            }
        }
    }

    changeHour(value, hour: any, day, time: string, i: number) {
        const index = day.hours.indexOf(hour);
    
        if (this.vehicles.id > 0) {
            if (time === 'start') {
                day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
            }
    
            if (hour.id > 0) {
                if (day.hours[index].timeStart >= 0 && day.hours[index].timeEnd >= 0) {
                    this.backendService
                        .put('vehicle_schedule_hour/' + hour.id, day.hours[index])
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant(
                                        'CONFIGURATIONS.UPDATE_NOTIFICATIONS',
                                    ),
                                    this.translate.instant('GENERAL.ACCEPT'),
                                );
                                this.detectChange.detectChanges();
                            },
                            (error) => {
                                this.toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            },
                        );
                }
            } else {
                let schedule = this.vehicles.schedule.days.find(
                    (x) => x.intDay == day.intDay,
                );
    
                if (
                    day.hours[index].timeStart >= 0 &&
                    day.hours[index].timeEnd >= 0 &&
                    day.hours[index].timeStart != -1 &&
                    day.hours[index].timeEnd != -1
                ) {
                    this.backendService
                        .post('vehicle_schedule_hour', {
                            vehicleScheduleDayId: schedule.id,
                            timeStart: schedule.hours[index].timeStart,
                            timeEnd: schedule.hours[index].timeEnd,
                        })
                        .pipe(take(1))
                        .subscribe(
                            (response) => {
                                day.hours[index] = response.data;
    
                                this.toastService.displayWebsiteRelatedToast(
                                    this.translate.instant('GENERAL.REGISTRATION'),
                                    this.translate.instant('GENERAL.ACCEPT'),
                                );
    
                                this.detectChange.detectChanges();
                            },
                            (error) => {
                                this.toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            },
                        );
                }
            }
        } else {
            if (time === 'start') {
                day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
            } else {
                day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
            }
    
            this.detectChange.detectChanges();
        }
    }
    
    addScheduleToDay(intDay: number, item: any) {
        let schedule = this.vehicles.schedule.days.find((x) => x.intDay == intDay);
    
        schedule.hours.push({
            timeStart: -1,
            timeEnd: -1,
        });
    }

    deleteHours(intDay, hours) {
        let schedule = this.vehicles.schedule.days.find((x) => x.intDay == intDay);
        if (hours.id > 0) {
            this.backendService
                .delete('vehicle_schedule_hour/' + hours.id)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        const index = schedule.hours.indexOf(hours);
                        schedule.hours.splice(index, 1);
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        this.detectChange.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                    },
                );
        } else {
            const index = schedule.hours.indexOf(hours);
            schedule.hours.splice(index, 1);
            this.detectChange.detectChanges();
        }
    }

    /* end Aplicar horario por día */

    /* Aplicar especificación horaria */

     addTimeZone() {
        if (this.vehicles.timeZone.length > 0) {
            this.vehicles.timeZone.push({
                id: 0,
                vehicleId: 0,
                companyTimeZoneId: '',
            });
        } else {
            this.vehicles.timeZone.push({
                id: 0,
                vehicleId: 0,
                companyTimeZoneId: '',
            });
        }
    }

     /* Validate radio */
     validSpecificationService(hour, day) {
        let index = this.vehicles.timeZone.indexOf(hour);

        let exist = false;

        this.vehicles.timeZone.forEach((element, i) => {
            if (index !== i && !exist) {
                exist = element.companyTimeZoneId == hour.companyTimeZoneId ? true : false;
            }
        });

        return exist;
    }

     /* funcion para seleccionar especición horaria */
     changeSelectShedule(event: any, hours: any, target: any) {

        
        const index = this.vehicles.timeZone.indexOf(hours);

        const exist = this.vehicles.timeZone.find(
            (x) => x.companyTimeZoneId === Number(event),
        );

        let specification = this.vehicles.timeZone.find((x) => x.id == hours.id);

        //si hay uno igual ejemplo

        let returnEqual = false;

        if (this.vehicles.timeZone.length > 0) {

            this.vehicles.timeZone.forEach((element, i) => {
                if ('' + element.companyTimeZoneId === '' + event) {

                    this.error = true;

                    returnEqual = true;

                   

                    $('#' + target + ' option[value=""]');

                    $('#' + target).prop('value', hours.companyTimeZoneId);

                    this.detectChange.detectChanges();
                }
            });
        }

        if (returnEqual) return;

        if (this.vehicles.id > 0) {
            if (!exist) {
                if (specification.id > 0 && event.length > 0) {
                    this.updateSpecification(hours, event);
                } else if (event.length > 0) {
                    this.createSpeciticafion(hours, event);
                }
            } else {
                this.error = true;

                this.vehicles.timeZone[index].companyTimeZoneId = event;

                this.detectChange.detectChanges();
            }
        } else {
            const dist = this.vehicles.timeZone.find(
                (x) => x.companyTimeZoneId == Number(event),
            );
            if (!dist) {
                this.vehicles.timeZone[index].companyTimeZoneId = event;
                this.error = false;
                this.detectChange.detectChanges();
            } else {
                this.vehicles.timeZone[index].companyTimeZoneId = event;
                return (this.error = true);
            }

            this.detectChange.detectChanges();
        }
    }

    //servicio de crear especificación uno a uno
    createSpeciticafion(hours: any, event) {
        const index = this.vehicles.timeZone.indexOf(hours);

        this.backendService
            .post('vehicle_schedule_specification', {
                vehicleId: this.vehicles.id,

                companyTimeZoneId: event,
            })
            .pipe(take(1))
            .subscribe(
                (response) => {

                    this.vehicles.timeZone[index].id = response.data.id;

                    this.vehicles.timeZone[index].companyTimeZoneId =
                        response.data.companyTimeZoneId;

                    this.vehicles.timeZone[index].vehicleId = response.data.vehicleId;

                    //day.hours[index].default= response.data.default;

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.REGISTRATION'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.error = false;
                    this.detectChange.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(error.error.code, error.error);
                },
            );
    }

    //editar especificación uno a uno
    updateSpecification(hours: any, event: any) {
        this.backendService
            .put('vehicle_schedule_specification/' + hours.id, {
                id: hours.id,

                companyTimeZoneId: event,

                vehicleId: hours.vehicleId,
            })
            .pipe(take(1))
            .subscribe(
                (response) => {
                    hours.companyTimeZoneId = event;

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );

                    this.error = false;

                    this.detectChange.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(error.error.code, error.error);
                    this.detectChange.detectChanges();
                },
            );
    }

    deleteSpecification(intDay, hours) {
        let schedule = this.vehicles.timeZone.find((x) => x.id == intDay);

        if (hours.id > 0) {
            this.backendService
                .delete('vehicle_schedule_specification/' + hours.id)
                .pipe(take(1))
                .subscribe(
                    (response) => {
                        const index = this.vehicles.timeZone.indexOf(hours);

                        this.vehicles.timeZone.splice(index, 1);

                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );

                        this.error = false;

                        this.detectChange.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                    },
                );
        } else {
            const index = this.vehicles.timeZone.indexOf(hours);

            this.vehicles.timeZone.splice(index, 1);

            this.error = false;

            this.detectChange.detectChanges();
        }
    }


     /* end Aplicar especificación horaria */

     /* copiar horario de vehículos a horario por dia */
     copyAll(){
        console.log('aqui ira la funcion');
       
     }
     /* end copiar horario de vehículos a horario por dia  */

     redirect(){
        
        this.router.navigate(['management/client-settings']);
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

     submit() {
        const formValues = this.createVehicleFormGroup.value;

        console.log(formValues, 'formValues')

        //eliminar input chebox temporales

        delete formValues.activeScheduleMonday;
        delete formValues.activeScheduleTuesday;
        delete formValues.activeScheduleWednesday;
        delete formValues.activeScheduleThursday;
        delete formValues.activeScheduleFriday;
        delete formValues.activeScheduleSaturday;
        delete formValues.activeScheduleSunday;

        delete formValues.free;

     

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

            delete formValues.image;

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
    confirmAddition(form): Vehicle {
        console.log('este es el formulario', form);
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
            isActive: this.activeVehicles,

            vehicleBrand : form.get('vehicleBrand').value,

            model : form.get('model').value,
            
            frameNumber : form.get('frameNumber').value,
            
            acquisitionDate : form.get('acquisitionDate').value,
            
            lowDate : form.get('lowDate').value,
            
            licenseId : form.get('licenseId').value,
            
            tare : form.get('tare').value ? form.get('tare').value : null,
            
            mma : form.get('mma').value ? form.get('mma').value : null,
            
            usefulLoad : form.get('usefulLoad').value ? form.get('usefulLoad').value : null,
            
            liftGate : form.get('liftGate').value ? form.get('liftGate').value : null,
            
            length : form.get('length').value ? form.get('length').value : null,

            width : form.get('width').value ? form.get('width').value : null,

            totalVolumetricCapacity : form.get('totalVolumetricCapacity').value ? form.get('totalVolumetricCapacity').value : null,

            tall : form.get('tall').value ? form.get('tall').value : null,

            image: form.get('image').value ? form.get('image').value:'',

            idERP: form.get('idERP').value ? form.get('idERP').value : null
        };

        return datos;
    }
    addVehicle(vehicle: Vehicle) {
        this.vehiclesFacade.addVehicle(vehicle);
    }

    getFilterVAlue() {
        let selectedFilterIds: any;

        if (this.createVehicleFormGroup && this.vehicleServiceType.length > 0) {
            selectedFilterIds = this.createVehicleFormGroup.value.vehicleServiceType
                .map((v, i) => (v ? this.vehicleServiceType[i].id : null))
                .filter((v) => v !== null);
        }

        return selectedFilterIds;
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

    validateAbsolute() {
        if (this.createVehicleFormGroup.value.deliveryPointScheduleTypeId == 1) {
            return this.disabledBtnDaySchedule();
        } else if (this.createVehicleFormGroup.value.deliveryPointScheduleTypeId == 2) {
            return this.disabledBtnSpecification();
        }
    }

     /* Validación anterior  */
     disabledBtnDaySchedule() {
        let disabled = false;

        if (this.vehicles.schedule && this.vehicles.schedule.days) {
            this.vehicles.schedule.days.forEach((element, i) => {
                element.hours.forEach((result) => {
                    if (result.timeStart != -1 && result.timeEnd != -1) {
                        if (result.timeStart > result.timeEnd) {
                            disabled = true;
                            return disabled;
                        } else if (result.timeStart === result.timeEnd) {
                            disabled = true;
                            return disabled;
                        } else if (result.timeEnd < result.timeStart) {
                            disabled = true;
                            return disabled;
                        } else if (result.timeEnd === -1 && result.timeEnd === -1) {
                            disabled = true;
                            return disabled;
                        }
                    } else {
                        disabled = true;
                        return disabled;
                    }
                });
            });
        }

        return disabled;
    }

    /*Validate especificación  */
    disabledBtnSpecification() {
        return this.error;
      
    }

    totalVoluments(){

        
        let total;

        let length = this.createVehicleFormGroup.value.length;
        
        let width = this.createVehicleFormGroup.value.width;
        
        let tall = this.createVehicleFormGroup.value.tall;
        
        total = length*width*tall;

        
        this.totalVolument = total.toFixed(2);

        this.createVehicleFormGroup.get('totalVolumetricCapacity').setValue(this.totalVolument),

        this.createVehicleFormGroup.get('totalVolumetricCapacity').updateValueAndValidity();

        this.detectChange.detectChanges();
    }

     // aplicar horarios por default
     applyChangeScheduleVisit() {
        console.log('**** applyChangeSchedule ****');

        let data = {

            timeStart: dayTimeAsStringToSeconds(

                this.createVehicleFormGroup.get('deliveryWindowStart').value,

            ),

            timeEnd: dayTimeAsStringToSeconds(

                this.createVehicleFormGroup.get('deliveryWindowEnd').value,

            ),

        };

        if (this.vehicles.id > 0) {

            this.backendService

                .put('apply_schedule_every_day/vehicle/' + this.vehicles.id, {

                    deliveryWindowStart: dayTimeAsStringToSeconds(

                        this.createVehicleFormGroup.get('deliveryWindowStart').value,

                    ),

                    deliveryWindowEnd: dayTimeAsStringToSeconds(

                        this.createVehicleFormGroup.get('deliveryWindowEnd').value,

                    ),

                })

                .pipe(take(1))

                .subscribe(
                    (data) => {

                        this.loadingSchedule = true;

                        this.vehicles.schedule = {

                            days: data.data,

                        };

                        this.createVehicleFormGroup
                            .get('activeScheduleMonday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 1 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleTuesday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 2 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleWednesday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 3 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleThursday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 4 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleFriday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 5 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleSaturday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 6 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                        this.createVehicleFormGroup
                            .get('activeScheduleSunday')
                            .setValue(
                                this.vehicles.schedule &&
                                    this.vehicles.schedule.days &&
                                    this.vehicles.schedule.days.find(
                                        (x) => x.intDay === 7 && x.isActive === true,
                                    )
                                    ? true
                                    : false,
                            );
                       
                        
                        this.loadingSchedule = false;

                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('GENERAL.REGISTRATION'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                        this.detectChange.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                        this.loadingSchedule = false;
                    },
                );
        } else {

            console.log('ene l else');

            console.log( this.vehicles.schedule, ' this.vehicles');
            this.vehicles.schedule.days.forEach((element, i) => {

                if (element.hours.length > 0) {

                    console.log('en el if de forEach')

                    element.hours = [];

                    element.hours.push({

                        timeStart: data.timeStart,

                        timeEnd: data.timeEnd,

                    });

                } else {

                    console.log('en el else forEach');

                    element.hours.push({

                        timeStart: data.timeStart,

                        timeEnd: data.timeEnd,
                    }),
                        (element.isActive = true);
                }
            });

            this.createVehicleFormGroup
                .get('activeScheduleMonday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 1 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleTuesday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 2 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleWednesday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 3 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleThursday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 4 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleFriday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 5 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleSaturday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 6 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleSunday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 7 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.detectChange.detectChanges();
        }
    }

    changePuertaElevadora(event:any){

        switch (event) {
            case 'true':

                this.createVehicleFormGroup.get('liftGate').setValue(true);
                
                break;

                case 'false':

                    this.createVehicleFormGroup.get('liftGate').setValue(false);
                
                    break;

                    case '':

                        this.createVehicleFormGroup.get('liftGate').setValue('');
                
                    break;
        
            default:
                break;
        }
    
        this.createVehicleFormGroup.get('liftGate').updateValueAndValidity();
    }

    // aplicar horarios por default
    applyChangeSchedule(){
        console.log('** applyChangeSchedule **');
      
        let data ={
            timeStart : dayTimeAsStringToSeconds(this.createVehicleFormGroup.get('deliveryWindowStart').value),
            timeEnd :dayTimeAsStringToSeconds(this.createVehicleFormGroup.get('deliveryWindowEnd').value)
        }
        
        if (this.vehicles.id > 0) {
            console.log('if');
            this.backendService
            .put('apply_vehicle_schedule_every_day/vehicle/'+ this.vehicles.id,{
                deliveryWindowStart: dayTimeAsStringToSeconds(this.createVehicleFormGroup.get('deliveryWindowStart').value),
                deliveryWindowEnd: dayTimeAsStringToSeconds(this.createVehicleFormGroup.get('deliveryWindowEnd').value)
            }).pipe(take(1))
            .subscribe(
                (data) => {
                    this.loadingSchedule = true;
                    this.vehicles.schedule = {
                    days: data.data
                }
               
    
                this.loadingSchedule = false;
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('GENERAL.REGISTRATION'),
                    this.translate.instant('GENERAL.ACCEPT')
                )
                this.detectChange.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error.code,
                        error.error,
                    );
                    this.loadingSchedule = false;
        
                },
            );
        } else {
            
            
            this.vehicles.schedule.days.forEach((element, i) => {

                console.log(element, 'element');
                
                if (element.hours.length > 0) {
                    element.hours =[];
                    element.hours.push({
                        timeStart: data.timeStart,
                        timeEnd: data.timeEnd 
                    })
                } else {
                    element.hours.push({
                        timeStart: data.timeStart,
                        timeEnd: data.timeEnd 
                    }),
                    element.isActive = true;
                }
                this.createVehicleFormGroup
                .get('activeScheduleMonday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 1 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleTuesday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 2 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleWednesday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 3 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleThursday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 4 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleFriday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 5 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleSaturday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 6 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
            this.createVehicleFormGroup
                .get('activeScheduleSunday')
                .setValue(
                    this.vehicles.schedule &&
                        this.vehicles.schedule.days &&
                        this.vehicles.schedule.days.find(
                            (x) => x.intDay === 7 && x.isActive === true,
                        )
                        ? true
                        : false,
                );
                
            });
            
            this.detectChange.detectChanges();
        }

    }


    redirectUsersList() {
        this.router.navigateByUrl('management/users');
    }

}
