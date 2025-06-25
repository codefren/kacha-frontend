import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatePointsFacade } from '@easyroute/state-points';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AllowDelayTime, AssociatedCompany, BackendService, OptimizationPreferences, Point, Zone } from '@optimroute/backend';
import { dayTimeAsStringToSeconds, DeliveryZoneNameMessages, DurationPipe, LoadingService, secondsToDayTimeAsString, sliceMediaString, ToastService } from '@optimroute/shared';
import { DeliveryZones, StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { ModalRegisterTimeComponent } from '../modal-register-time/modal-register-time.component';

@Component({
  selector: 'easyroute-client-route-data',
  templateUrl: './client-route-data.component.html',
  styleUrls: ['./client-route-data.component.scss']
})
export class ClientRouteDataComponent implements OnInit {

  @Input() idParam: any;

  pointRouteForm: FormGroup;
  deliveryZoneName_messages: any;

  point: Point;

  focus: boolean;
  prefix: any = '';

  unsubscribe$ = new Subject<void>();
  zones: Observable<Zone[]>;
  zones$: Observable<DeliveryZones>;

  optimizationPreferences$: Observable<OptimizationPreferences>;

  showSelect: boolean = false;
  loadedZones: boolean = false;
  
  dateCreatedAt: any;
  dateDisabledAt: any;
  endDisabledAtConfirmar: any;
  startCreatedAtConfirmar: any;

  showcompanys: boolean = false;
  associatedCompany: AssociatedCompany[] = [];
 
  showUserAgent: boolean = false;
  userAgent: any[];

  showServiceType: boolean = true;

  deliveryPointServiceType: any;

  showSpecificationType: boolean = false
  deliveryZoneSpecificationType: any;

  allowDelayTime: AllowDelayTime[] = [];
  showDelaySeccion: boolean = false;

  constructor(  
    private _activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder,
    private profileFacade: ProfileSettingsFacade,
    private backendService: BackendService,
    private easyRouteFacade: StateEasyrouteFacade,
    private zoneFacade: StateDeliveryZonesFacade,
    private detectChanges: ChangeDetectorRef,
    private loadingService: LoadingService,
    private facade: StatePointsFacade,
    private facadePreference: PreferencesFacade,
    private translate: TranslateService,
    private router: Router,
    public durationPipe: DurationPipe,
    private _modalService: NgbModal,
    public authLocal: AuthLocalService,
    private stateEasyrouteService: StateEasyrouteService,
    private service: StateUsersService,
  ) {}

  ngOnInit() {

    //this.loadingService.showLoading();

    this.optimizationPreferences$ = this.facadePreference.optimizationPreferences$;
    this.easyRouteFacade.isAuthenticated$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((isAuthenticated: boolean) => {
            if (isAuthenticated) {
                this.zoneFacade.loadAll();
            }
        });

    // validar si esta activado el tiempo de retraso en clientes
    this.optimizationPreferences$.pipe(takeUntil(this.unsubscribe$)).subscribe((op) => {
        this.showDelaySeccion = op.allowDelayTime;
    });

    this.zones$ = this.zoneFacade.state$;
    this.zones$.pipe(takeUntil(this.unsubscribe$)).subscribe((zoneState) => {
        if (zoneState.loaded) {
            this.showSelect = true;
            this.zones = this.zoneFacade.allDeliveryZones$;
            this.loadedZones = true;
        }
    });

    this.setAllowDelayTime();
    this.validateRoute();
  }

  setCompaniesAsociated() {
    setTimeout(() => {
        this.backendService
            .get('company_associated_list')
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.associatedCompany = data;
                    this.showcompanys = true;
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }, 500);
  }

  validateRoute() {
    if (this.idParam === 'new') {
        this.point = new Point();
        this.initForm();
        this.loadingService.hideLoading();
    } else {
        this.backendService
            .get(`delivery_point/${this.idParam}`)
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.point = data;
                    this.initForm();
                    this.loadingService.hideLoading();
                },
                (error) => {
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        
    }
  }

  initForm() {
    
    let totalSeconds = +this.point.leadTime;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // delayTime
    let totalSeconds_delay = +this.point.allowedDelayTime;
    let hours_delay = Math.floor(totalSeconds_delay / 3600);
    totalSeconds_delay %= 3600;
    let minutes_delay = Math.floor(totalSeconds_delay / 60);
    let seconds_delay = totalSeconds_delay % 60;

    if (this.point.created_at) {
        this.dateCreatedAt = moment(this.point.created_at).format('YYYY-MM-DD');
    }

    if (this.point.disabled_at) {
        this.dateDisabledAt =  moment(this.point.disabled_at).format('YYYY-MM-DD');
    }

    // formulario
    this.pointRouteForm = this.fb.group(
        {
            id: [this.point.id || ''],
            name: [this.point.name, [Validators.required]],
            address: [this.point.address, [Validators.required]],
            billingAddress: [this.point.billingAddress],
            demand: [this.point.demand, [Validators.required]],
            serviceTimeMinute: [
                parseInt('' + this.point.serviceTime / 60),
                [Validators.required, Validators.min(0), Validators.max(59)],
            ],
            serviceTimeSeconds: [
                Math.round(((this.point.serviceTime / 60) % 1) * 60),
                [Validators.required, Validators.min(0), Validators.max(59)],
            ],
            keyOpen: [this.point.keyOpen, [Validators.required]],
            deliveryWindowStart: [
                this.point.deliveryWindowStart
                    ? secondsToDayTimeAsString(+this.point.deliveryWindowStart)
                    : secondsToDayTimeAsString(0),
            ],
            deliveryWindowEnd: [
                this.point.deliveryWindowEnd
                    ? secondsToDayTimeAsString(+this.point.deliveryWindowEnd)
                    : secondsToDayTimeAsString(86399),
            ],
            postalCode: [this.point.postalCode],
            population: [this.point.population],
            province: [this.point.province],
            phoneNumber: [
                this.point.phoneNumber ? this.point.phoneNumber : this.prefix,
            ],
            email: [this.point.email],
            deliveryPointPaymentTypeId: [
                this.point.deliveryPointPaymentTypeId
                    ? this.point.deliveryPointPaymentTypeId
                    : '',
            ],
            fiscalName: [
                this.point.fiscalName,
                [Validators.minLength(1), Validators.maxLength(30)],
            ],
            created_at: [this.dateCreatedAt],
            disabled_at: [this.dateDisabledAt],
            contactName: [this.point.contactName],
            deliveryZoneId: [this.point.deliveryZoneId],
            coordinatesLatitude: [
                this.point.coordinatesLatitude,
                [
                    Validators.required,
                    Validators.pattern('^-?[0-9]{1,3}(?:.[0-9]{0,14})?$'),
                ],
            ],
            coordinatesLongitude: [
                this.point.coordinatesLongitude,
                [
                    Validators.required,
                    Validators.pattern('^-?[0-9]{1,3}(?:.[0-9]{0,14})?$'),
                ],
            ],
            nif: [this.point.nif],
            hours: [hours ? hours : 0],
            minutes: [minutes ? minutes : 0],
            seconds: [seconds ? seconds : 0],
            hours_delay: [hours_delay ? hours_delay : 0],
            minutes_delay: [minutes_delay ? minutes_delay : 0],
            seconds_delay: [seconds_delay ? seconds_delay : 0],
            sendDeliveryNoteMail: [this.point.sendDeliveryNoteMail],
            companyAssociatedId: [
                this.point.companyAssociatedId !== null
                    ? this.point.companyAssociatedId
                    : '',
            ],
            agentUserId: [this.point.agent_user ? this.point.agent_user.id : ''],
            equivalence: [this.point.equivalence || false],
            verifiedByDriver: [this.point.verifiedByDriver || false],
            isActive: [this.point.isActive || false],
            deliveryPointServiceType: [
                this.point.deliveryPointServiceType &&
                this.point.deliveryPointServiceType.id
                    ? this.point.deliveryPointServiceType &&
                      this.point.deliveryPointServiceType.id
                    : null,
            ],
            deliveryZoneSpecificationType: [
                this.point.deliveryZoneSpecificationType &&
                this.point.deliveryZoneSpecificationType.id
                    ? this.point.deliveryZoneSpecificationType &&
                      this.point.deliveryZoneSpecificationType.id
                    : null,
            ],

            phones: [''],
            showDeliveryNotePrice: [this.point.showDeliveryNotePrice],
            activateDeliverySchedule: [this.point.activateDeliverySchedule],


            observations: [],
            companyPreferenceDelayTimeId: [
                this.point.companyPreferenceDelayTimeId
                    ? this.point.companyPreferenceDelayTimeId
                    : '',
            ],
            allowDelayTime: [this.point.allowDelayTime],
            statusDeliveryPointId: [
                this.point.statusDeliveryPointId
                    ? this.point.statusDeliveryPointId
                    : '',
            ],
            free: [],
        },
        //{ validator: this.checkStartAndEndTime },
    );

    this.changeSendDeliveryNoteMail(this.pointRouteForm.get('sendDeliveryNoteMail').value);

    /* this.pointRouteForm.controls['created_at'].setValidators([
        this.endDisabledAtConfirmar.bind(this.pointRouteForm),
    ]);

    this.pointRouteForm.controls['disabled_at'].setValidators([
        this.startCreatedAtConfirmar.bind(this.pointRouteForm),
    ]); */

    this.pointRouteForm.get('created_at').updateValueAndValidity();
    this.pointRouteForm.get('disabled_at').updateValueAndValidity();

    this.deliveryZoneName_messages = new DeliveryZoneNameMessages().getDeliveryZoneNameMessages();

    this.setCompaniesAsociated();
    this.setUserAgent();
    this.getSDeliveryZonepecificationtype();
    this.getServiceTypeVehicle();

    this.detectChanges.detectChanges();
  }

  changeSendDeliveryNoteMail(value: any) {
    this.focus = false;

    if (value) {
        this.pointRouteForm
            .get('email')
            .setValidators([Validators.required, Validators.email]);

        this.pointRouteForm.get('email').updateValueAndValidity();

        if (!this.pointRouteForm.get('email').value) {
            this.focus = true;
        }
    } else {
        this.pointRouteForm.get('email').setValidators(null);
        this.pointRouteForm.get('email').updateValueAndValidity();

        this.pointRouteForm.controls['email'].setValidators([Validators.email]);
    }

    this.detectChanges.detectChanges();
  }

  setUserAgent() {
    setTimeout(() => {
        this.backendService
            .get('users_salesman?userSalesmanId=' + this.point.agentUserId)
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.userAgent = data;
                    this.showUserAgent = true;
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error,
                        error.error.error,
                    );
                },
            );
    }, 500);
  }


  modalRegisterTime() {

    const dialogRef = this._modalService.open(ModalRegisterTimeComponent, {
        backdropClass: 'customBackdrop',
        centered: true,
        size: 'md',
        backdrop: 'static',
        windowClass:'modal-client',
    });
    dialogRef.componentInstance.pointId = this.point.id;

    dialogRef.result.then((result) => {

        if (result) {

        }
    }, (reason) => {

    });

}

    setAllowDelayTime() {
        setTimeout(() => {
            this.backendService
                .get('company_preference_delay_time_type')
                .pipe(take(1))
                .subscribe(
                    ({ data }) => {
                        this.allowDelayTime = data;
                        this.detectChanges.detectChanges();
                    },
                    (error) => {
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
        }, 500); 
    }


    //Especificacion de servicios

    getServiceTypeVehicle() {

        this.showServiceType = false;
    
        this.service.loadVehiclesServiceType().subscribe(({ data }) => {

            this.showServiceType = true;
    
            this.deliveryPointServiceType = data;
    
        });
    }

    openServiceType(value: any) {
        /* this.router.navigateByUrl('management-logistics/vehicles/servies-type'); */
        //this.router.navigate([`/management-logistics/vehicles/settings/${this.idParam}/${value}/client`]);
        this.router.navigateByUrl('/preferences?option=vehicleSpecification');
    }
    
    openDeliveryZoneSpecificationType() {
        this.router.navigateByUrl('/preferences?option=routeSpecification');
    }
    
    
    sliceString(text: string) {
        return sliceMediaString(text, 24, '(min-width: 960px)');
    }


    // Especificaciones de rutas
    getSDeliveryZonepecificationtype() {
        this.showServiceType = false;

        this.backendService
            .get('delivery_zone_specification_type')
            .pipe(take(1))
            .subscribe(
                (data) => {
                    this.deliveryZoneSpecificationType = data.data;

                    console.log(this.deliveryZoneSpecificationType)

                    this.showServiceType = true;
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }

    getSpecificationVAlue() {
        let selectedFilterIds: any;

        if (
            this.deliveryZoneSpecificationType &&
            this.deliveryZoneSpecificationType.length > 0
        ) {
            selectedFilterIds = this.pointRouteForm.value.deliveryZoneSpecificationType
                .map((v, i) => (v ? this.deliveryZoneSpecificationType[i].id : null))
                .filter((v) => v !== null);
        }

        return selectedFilterIds;
    }

    validationDElayTime(value: boolean) {
        if (value && this.allowDelayTime.length > 0) {

            this.pointRouteForm
                .get('companyPreferenceDelayTimeId')
                .setValidators([Validators.required]);

            this.pointRouteForm.get('companyPreferenceDelayTimeId').updateValueAndValidity();

            this.detectChanges.detectChanges();
        } else {

            this.pointRouteForm.get('companyPreferenceDelayTimeId').setValidators(null);

            this.pointRouteForm.get('companyPreferenceDelayTimeId').setValue('');

            this.pointRouteForm.get('companyPreferenceDelayTimeId').updateValueAndValidity();

            this.detectChanges.detectChanges();
        }

        this.pointRouteForm.get('companyPreferenceDelayTimeId').updateValueAndValidity();
    }

    submit() {
        this.loadingService.showLoading();

        let dataForm = _.cloneDeep(this.pointRouteForm.value);

        let time: number =
            this.pointRouteForm.value.hours * 3600 +
            this.pointRouteForm.value.minutes * 60 +
            this.pointRouteForm.value.seconds;

        let timeDelay: number =
            this.pointRouteForm.value.hours_delay * 3600 +
            this.pointRouteForm.value.minutes_delay * 60 +
            this.pointRouteForm.value.seconds_delay;

        delete dataForm.serviceTimeMinute;
        delete dataForm.serviceTimeSeconds;
        delete dataForm.hours;
        delete dataForm.minutes;
        delete dataForm.seconds;
        delete dataForm.hours_delay;
        delete dataForm.minutes_delay;
        delete dataForm.seconds_delay;

        //eliminar input chebox temporales
        delete dataForm.activeScheduleMonday;
        delete dataForm.activeScheduleTuesday;
        delete dataForm.activeScheduleWednesday;
        delete dataForm.activeScheduleThursday;
        delete dataForm.activeScheduleFriday;
        delete dataForm.activeScheduleSaturday;
        delete dataForm.activeScheduleSunday;

        delete dataForm.fixedDeliveryScheduleMonday;
        delete dataForm.fixedDeliveryScheduleTuesday;
        delete dataForm.fixedDeliveryScheduleWednesday;
        delete dataForm.fixedDeliveryScheduleThursday;
        delete dataForm.fixedDeliveryScheduleFriday;
        delete dataForm.fixedDeliveryScheduleSaturday;
        delete dataForm.fixedDeliveryScheduleSunday;

        /// eliminar campos temporales visit
        delete dataForm.activeScheduleMondayVisit;
        delete dataForm.activeScheduleTuesdayVisit;
        delete dataForm.activeScheduleWednesdayVisit;
        delete dataForm.activeScheduleThursdayVisit;
        delete dataForm.activeScheduleFridayVisit;
        delete dataForm.activeScheduleSaturdayVisit;
        delete dataForm.activeScheduleSundayVisit;

        delete dataForm.fixedDeliveryScheduleMondayVisit;
        delete dataForm.fixedDeliveryScheduleTuesdayVisit;
        delete dataForm.fixedDeliveryScheduleWednesdayVisit;
        delete dataForm.fixedDeliveryScheduleThursdayVisit;
        delete dataForm.fixedDeliveryScheduleFridayVisit;
        delete dataForm.fixedDeliveryScheduleSaturdayVisit;
        delete dataForm.fixedDeliveryScheduleSundayVisit;
        delete dataForm.free;

        dataForm.companyAssociatedId =
            dataForm.companyAssociatedId === '' || dataForm.companyAssociatedId === null
                ? null
                : dataForm.companyAssociatedId;

        dataForm.deliveryWindowStart = dayTimeAsStringToSeconds(
            this.pointRouteForm.value.deliveryWindowStart,
        );

        dataForm.deliveryWindowEnd = dayTimeAsStringToSeconds(
            this.pointRouteForm.value.deliveryWindowEnd,
        );

        dataForm.serviceTime =
            this.pointRouteForm.value.serviceTimeMinute * 60 +
            this.pointRouteForm.value.serviceTimeSeconds;

        dataForm.agentUserId =
            dataForm.agentUserId === null || dataForm.agentUserId === ''
                ? null
                : dataForm.agentUserId;

        dataForm.leadTime = time;
        dataForm.allowedDelayTime = timeDelay;
        dataForm.deliveryPointServiceType = this.pointRouteForm.value.deliveryPointServiceType;
        dataForm.images = this.point.images;
        dataForm.deliveryZoneSpecificationType = this.pointRouteForm.value.deliveryZoneSpecificationType;
        /* dataForm.deliveryZoneSpecificationType =this.getSpecificationVAlue(); */

        if (
            this.point.id.length === 0 &&
            this.point.schedule &&
            this.point.schedule.days &&
            this.point.schedule.days.length > 0 &&
            this.pointRouteForm.value.activateDeliverySchedule
        ) {
            this.point.schedule.days.forEach((day) => {
                let hours = day.hours.filter((x) => x.timeStart >= 0 && x.timeEnd >= 0);
                day = {
                    ...day,
                    hours: hours,
                };
            });

            if (dataForm.deliveryPointScheduleTypeId == 1) {
                dataForm.schedule = {
                    days: this.point.schedule.days.filter((x) => x.isActive === true),
                };

                delete dataForm.scheduleSpecification;
            } else {
                dataForm.scheduleSpecification = {
                    // ...this.point.schedule,

                    days: this.point.schedule.days.filter((x) => x.isActive === true),
                };

                delete dataForm.schedule;
            }
        }

        //visit

        if (
            this.point.id.length === 0 &&
            this.point.scheduleVisit &&
            this.point.scheduleVisit.days &&
            this.point.scheduleVisit.days.length > 0 &&
            this.pointRouteForm.value.activateDeliveryVisitSchedule
        ) {
            this.point.scheduleVisit.days.forEach((day) => {
                let hours = day.hours.filter((x) => x.timeStart >= 0 && x.timeEnd >= 0);
                day = {
                    ...day,
                    hours: hours,
                };
            });

            if (dataForm.activateDeliveryVisitSchedule) {
                dataForm.scheduleVisit = {
                    days: this.point.scheduleVisit.days.filter((x) => x.isActive === true),
                };
            }
        }

        if (!this.pointRouteForm.value.activateDeliveryVisitSchedule) {
            dataForm.scheduleVisit = [];
        }
        //end visit

        if (!this.pointRouteForm.value.activateDeliverySchedule) {
            dataForm.schedule = [];
            dataForm.scheduleSpecification = [];
            dataForm.deliveryPointScheduleTypeId = null;
        }

        this.zones.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            console.log(data, '940 error');
            if (dataForm.deliveryZoneCompanyId) {
                dataForm.deliveryZoneCompanyId = data.find(
                    (x: any) => x.id == dataForm.deliveryZoneId,
                ).Company.id;
            }
        });

        if (this.pointRouteForm.invalid) {
            this.toastService.displayWebsiteRelatedToast('The point is not valid'),
                this.translate.instant('GENERAL.ACCEPT');
            this.loadingService.hideLoading();
        } else {
            if (!this.point.id || this.point.id === null || this.point.id === '') {
                
                console.log(dataForm, 'dataForm');
                this.addPoint(dataForm);
                this.facade.added$.pipe(take(2)).subscribe(
                    (data) => {
                        if (data) {
                            this.loadingService.hideLoading();
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('CLIENTS.CREATE_CLIENT'),
                                this.translate.instant('GENERAL.ACCEPT'),
                            );
                            this.router.navigateByUrl('management/clients');
                        }
                    },
                    (error) => {
                        console.log('aqui');
                        this.loadingService.hideLoading();
                        this.toastService.displayHTTPErrorToast(error, 'error al crear');
                    },
                );
            } else {
                delete dataForm.phones;
                delete dataForm.schedule;
                delete dataForm.scheduleVisit;
                delete dataForm.scheduleSpecification;
                delete dataForm.observations;
                delete dataForm.images;
                this.updatePoint([this.point.id, dataForm]);
                this.facade.updated$.pipe(take(2)).subscribe(
                    (data) => {
                        if (data) {
                            this.loadingService.hideLoading();
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('CLIENTS.UPDATE_CLIENT'),
                                this.translate.instant('GENERAL.ACCEPT'),
                            );
                            this.router.navigateByUrl('management/clients');
                        }
                    },
                    (error) => {
                        this.loadingService.hideLoading();
                        this.toastService.displayHTTPErrorToast(
                            error,
                            'error al actualizar',
                        );
                    },
                );
            }
        }
    }

    addPoint(point: Point) {
        this.facade.addPoint(point);
      }
      
      updatePoint(obj: [string, Partial<Point>]) {
          this.facade.editPoint(obj[0], obj[1]);
      }

}
