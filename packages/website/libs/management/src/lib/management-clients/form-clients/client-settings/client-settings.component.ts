import { ChangeDetectorRef, Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatePointsFacade } from '@easyroute/state-points';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Point } from '@optimroute/backend';
import { dayTimeAsStringToSeconds, DeliveryZoneNameMessages, DurationPipe, LoadingService, secondsToDayTimeAsString, ToastService } from '@optimroute/shared';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'easyroute-client-settings',
  templateUrl: './client-settings.component.html',
  styleUrls: ['./client-settings.component.scss']
})
export class ClientSettingsComponent implements OnInit, OnChanges {
  
  @Input() idParam: any;
  
  point: Point;

  pointSettingForm: FormGroup;
  deliveryZoneName_messages: any;

  showUseBillingAddress: boolean = false;

  dateCreatedAt: any;
  dateDisabledAt: any;

  deliveryPointId:  string;
  
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
    private preferencesFacade: PreferencesFacade,
    private translate: TranslateService,
    private router: Router,
    public durationPipe: DurationPipe,
    private _modalService: NgbModal,
    public authLocal: AuthLocalService,
    private stateEasyrouteService: StateEasyrouteService,
  ) {}

  ngOnInit() { }

  ngOnChanges() {

    this.loadingService.showLoading();

    this.validateRoute();

  }

  validateRoute() {
    if (this.idParam === 'new') {
        this.point = new Point();
        this.initForm();
        this.loadingService.hideLoading();
    } else {

        this.deliveryPointId = this.idParam
        this.backendService
            .get(`delivery_point/${this.idParam}`)
            .pipe(take(1))
            .subscribe(
                ({ data }) => {
                    this.point = data;
                    this.initForm();
                    this.changeAddres(data.useBillingAddress);

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
    this.pointSettingForm = this.fb.group(
        {
            id: [this.point.id || ''],
            name: [this.point.name, [Validators.required]],
            address: [this.point.address, [Validators.required]],
            useBillingAddress: [this.point.useBillingAddress],
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
            /* phoneNumber: [
                this.point.phoneNumber ? this.point.phoneNumber : this.prefix,
            ], */
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

            phones: [''],
            showDeliveryNotePrice: [this.point.showDeliveryNotePrice],
            //activateDeliverySchedule: [this.point.activateDeliverySchedule],


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
        /* { validator: this.checkStartAndEndTime }, */
    );

    this.pointSettingForm.get('created_at').updateValueAndValidity();
    this.pointSettingForm.get('disabled_at').updateValueAndValidity();

    this.deliveryZoneName_messages = new DeliveryZoneNameMessages().getDeliveryZoneNameMessages();

    this.detectChanges.detectChanges();
  }

  changeAddres(event: any) {
    if (event) {
        this.showUseBillingAddress = event;
        this.pointSettingForm.get('useBillingAddress').setValidators([Validators.required]);
        this.pointSettingForm.controls['useBillingAddress'].setValue(event);
        this.pointSettingForm.get('billingAddress').setValidators([Validators.required]);
    } else {
        this.showUseBillingAddress = event;
        this.pointSettingForm.get('useBillingAddress').setValidators(null);
        this.pointSettingForm.controls['useBillingAddress'].setValue(event);
        this.pointSettingForm.get('billingAddress').setValidators(null);
        this.pointSettingForm.controls['billingAddress'].setValue(null);
    }
  }
  
  submit() {
    this.loadingService.showLoading();

    let dataForm = _.cloneDeep(this.pointSettingForm.value);

    let time: number =
        this.pointSettingForm.value.hours * 3600 +
        this.pointSettingForm.value.minutes * 60 +
        this.pointSettingForm.value.seconds;

    let timeDelay: number =
        this.pointSettingForm.value.hours_delay * 3600 +
        this.pointSettingForm.value.minutes_delay * 60 +
        this.pointSettingForm.value.seconds_delay;

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
    delete dataForm.conceptSecundaryPhone;

    dataForm.deliveryWindowStart = dayTimeAsStringToSeconds(
        this.pointSettingForm.value.deliveryWindowStart,
    );

    dataForm.deliveryWindowEnd = dayTimeAsStringToSeconds(
        this.pointSettingForm.value.deliveryWindowEnd,
    );

    dataForm.serviceTime =
        this.pointSettingForm.value.serviceTimeMinute * 60 +
        this.pointSettingForm.value.serviceTimeSeconds;

    dataForm.agentUserId =
        dataForm.agentUserId === null || dataForm.agentUserId === ''
            ? null
            : dataForm.agentUserId;

    dataForm.leadTime = time;
    dataForm.allowedDelayTime = timeDelay;
    dataForm.deliveryPointServiceType = this.pointSettingForm.value.deliveryPointServiceType;

    if (this.pointSettingForm.invalid) {
        this.toastService.displayWebsiteRelatedToast('The point is not valid'),
            this.translate.instant('GENERAL.ACCEPT');
        this.loadingService.hideLoading();
    } else {
        if (!this.point.id || this.point.id === null || this.point.id === '') {

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
