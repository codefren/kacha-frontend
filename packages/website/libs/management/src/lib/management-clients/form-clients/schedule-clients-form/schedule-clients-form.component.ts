import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProfileSettingsFacade } from '../../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { StateEasyrouteFacade } from '../../../../../../state-easyroute/src/lib/+state/state-easyroute.facade';
import { StateDeliveryZonesFacade } from '../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { StatePointsFacade } from '../../../../../../state-points/src/lib/+state/state-points.facade';
import { PreferencesFacade } from '../../../../../../state-preferences/src/lib/+state/preferences.facade';
import { TranslateService } from '@ngx-translate/core';
import { DurationPipe } from '../../../../../../shared/src/lib/pipes/duration.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { dayTimeAsStringToSeconds, secondsToDayTimeAsString } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { take } from 'rxjs/operators';
import { Point } from '../../../../../../backend/src/lib/types/point.type';
import * as _ from 'lodash';
import { dateToObject, objectToString } from '../../../../../../shared/src/lib/util-functions/date-format';
import { DeliveryZoneNameMessages } from '../../../../../../shared/src/lib/messages/delivery-zone-name/delivery-zone-name.message';
declare function init_plugins();
declare var $: any;
@Component({
  selector: 'easyroute-schedule-clients-form',
  templateUrl: './schedule-clients-form.component.html',
  styleUrls: ['./schedule-clients-form.component.scss']
})
export class ScheduleClientsFormComponent implements OnInit {

    @Input('point') point: Point;
    
    @Output('clients')
    clients: EventEmitter<any> = new EventEmitter();
    @Input() idParam: any;

  pointForm: FormGroup;

  loadingVisit: boolean = false;

  type: any[] = [];

  loadingSchedule: boolean = false;

  copyScheduleDay: any;

  dateCreatedAt: any;

  dateDisabledAt: any;

  deliveryZoneName_messages: any;

  companyTimeZone: any[] = [];

  error: boolean = false;

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
        private preferencesFacade: PreferencesFacade,
        public durationPipe: DurationPipe,
        private _modalService: NgbModal,
        public authLocal: AuthLocalService,
        private stateEasyrouteService: StateEasyrouteService,
  ) { }

  ngOnInit() {
    this.load();
   
  }
  load() {
    if (this.point.id && this.point.id.length > 0) {
        console.log( this.point, 'cuando es editar')
      this.initForm();
        
       
     
    } else {
        console.log(this.point ,'nuevo');
        this.point = new Point();
        this.initForm();
    }

}


  setTimeoutFuntion() {
    setTimeout(() => {
        init_plugins();
    }, 500);
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

  let disabledId = this.point.id ? true : false;

  if (this.point.created_at) {
      this.dateCreatedAt = dateToObject(this.point.created_at);
  }

  if (this.point.disabled_at) {
      this.dateDisabledAt = dateToObject(this.point.disabled_at);
  }

  // formulario
  this.pointForm = this.fb.group(
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
          phoneNumber: [
              this.point.phoneNumber,
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
          /* accountingCode:[this.point.accountingCode, [ Validators.minLength(1), Validators.maxLength(30) ] ],
          specialConditions:[this.point.specialConditions, [Validators.minLength(1), Validators.maxLength(255)]],
          specialRate:[this.point.specialRate ,[ Validators.min(1), Validators.max(99999)] ],
          maximumUnpaid:[ this.point.maximumUnpaid , [ Validators.min(1), Validators.max(99999)]], */
          created_at: [this.dateCreatedAt],
          disabled_at: [this.dateDisabledAt],
          contactName: [this.point.contactName],
          //deliveryZoneId: [this.point.deliveryZoneId, this.setValidatorClient() ],
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
          /* deliveryPointServiceType: this.fb.array([]), */
          deliveryPointServiceType: [
              this.point.deliveryPointServiceType &&
              this.point.deliveryPointServiceType.id
                  ? this.point.deliveryPointServiceType &&
                    this.point.deliveryPointServiceType.id
                  : null,
          ],
          //deliveryZoneSpecificationType: this.fb.array([]),
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
          activeScheduleMonday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find((x) => x.intDay === 1)
                  ? true
                  : false,
          ],
          activeScheduleTuesday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find((x) => x.intDay === 2)
                  ? true
                  : false,
          ],
          activeScheduleWednesday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find((x) => x.intDay === 3)
                  ? true
                  : false,
          ],
          activeScheduleThursday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find((x) => x.intDay === 4)
                  ? true
                  : false,
          ],
          activeScheduleFriday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find((x) => x.intDay === 5)
                  ? true
                  : false,
          ],
          activeScheduleSaturday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find((x) => x.intDay === 6)
                  ? true
                  : false,
          ],
          activeScheduleSunday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find((x) => x.intDay === 7)
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleMonday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find(
                  (x) => x.intDay === 1 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleTuesday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find(
                  (x) => x.intDay === 2 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleWednesday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find(
                  (x) => x.intDay === 3 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleThursday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find(
                  (x) => x.intDay === 4 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleFriday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find(
                  (x) => x.intDay === 5 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleSaturday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find(
                  (x) => x.intDay === 6 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleSunday: [
              this.point.schedule &&
              this.point.schedule.days &&
              this.point.schedule.days.find(
                  (x) => x.intDay === 7 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          deliveryPointScheduleTypeId: [
              this.point.deliveryPointScheduleTypeId
                  ? this.point.deliveryPointScheduleTypeId
                  : 1,
          ],
          //Visit
          activeScheduleMondayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find((x) => x.intDay === 1)
                  ? true
                  : false,
          ],
          activeScheduleTuesdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find((x) => x.intDay === 2)
                  ? true
                  : false,
          ],
          activeScheduleWednesdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find((x) => x.intDay === 3)
                  ? true
                  : false,
          ],
          activeScheduleThursdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find((x) => x.intDay === 4)
                  ? true
                  : false,
          ],
          activeScheduleFridayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find((x) => x.intDay === 5)
                  ? true
                  : false,
          ],
          activeScheduleSaturdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find((x) => x.intDay === 6)
                  ? true
                  : false,
          ],
          activeScheduleSundayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find((x) => x.intDay === 7)
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleMondayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find(
                  (x) => x.intDay === 1 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleTuesdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find(
                  (x) => x.intDay === 2 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleWednesdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find(
                  (x) => x.intDay === 3 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleThursdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find(
                  (x) => x.intDay === 4 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleFridayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find(
                  (x) => x.intDay === 5 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleSaturdayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find(
                  (x) => x.intDay === 6 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],
          fixedDeliveryScheduleSundayVisit: [
              this.point.scheduleVisit &&
              this.point.scheduleVisit.days &&
              this.point.scheduleVisit.days.find(
                  (x) => x.intDay === 7 && x.fixedDelivery === true,
              )
                  ? true
                  : false,
          ],

          schedule: [],
          scheduleSpecification: [],
          observations: [],
          images: [''],
          companyPreferenceDelayTimeId: [
              this.point.companyPreferenceDelayTimeId
                  ? this.point.companyPreferenceDelayTimeId
                  : '',
          ],
          allowDelayTime: [this.point.allowDelayTime],
          statusDeliveryPointId: [
              this.point.statusDeliveryPointId
                  ? this.point.statusDeliveryPointId
                  : null,
          ],
          deliveryWindowVisitStart: [
              this.point.deliveryWindowVisitStart
                  ? secondsToDayTimeAsString(+this.point.deliveryWindowVisitStart)
                  : secondsToDayTimeAsString(0),
          ],
          deliveryWindowVisitEnd: [
              this.point.deliveryWindowVisitEnd
                  ? secondsToDayTimeAsString(+this.point.deliveryWindowVisitEnd)
                  : secondsToDayTimeAsString(86399),
          ],
          activateDeliveryVisitSchedule: [this.point.activateDeliveryVisitSchedule],
          /*  deliveryPointVisitScheduleTypeId:[ this.point.deliveryPointVisitScheduleTypeId ? this.point.deliveryPointVisitScheduleTypeId: 1], */
          free: [],
      },
      { validator: this.checkStartAndEndTime },
  );

  this.pointForm.controls['deliveryWindowStart'].setValidators([
      this.ValidatorWindowsStart.bind(this.pointForm),
  ]);

  this.pointForm.controls['deliveryWindowEnd'].setValidators([
      this.ValidatorWindowsEnd.bind(this.pointForm),
  ]);

  this.pointForm.controls['deliveryWindowVisitStart'].setValidators([
      this.ValidatorWindowsStartVisit.bind(this.pointForm),
  ]);

  this.pointForm.controls['deliveryWindowVisitEnd'].setValidators([
      this.ValidatorWindowsEndVisit.bind(this.pointForm),
  ]);

 
  this.pointForm.get('created_at').updateValueAndValidity();
  this.pointForm.get('disabled_at').updateValueAndValidity();

  this.deliveryZoneName_messages = new DeliveryZoneNameMessages().getDeliveryZoneNameMessages();

  if (this.pointForm.value.deliveryPointScheduleTypeId == 1) {
      this.getDeliveryPointSchedule();
  } else if (this.pointForm.value.deliveryPointScheduleTypeId == 2) {
      this.getScheduleSpecification();
  }

  if (this.pointForm.value.activateDeliveryVisitSchedule) {
      this.getDeliveryPointScheduleVisit();
  }

  
  this.getDeliveryPointType();
  // this.getDeliveryVisitScheduleType();
  this.getCompanyTimeZone();

  this.detectChanges.detectChanges();
}
checkStartAndEndTime(group: FormGroup) {
  // here we have the 'passwords' group
  let start = dayTimeAsStringToSeconds(group.controls.deliveryWindowStart.value);
  let end = dayTimeAsStringToSeconds(group.controls.deliveryWindowEnd.value);
  let valueEnd = end == -1 ? true : false;
  let valueStart = start == -1 ? true : false;
  return end >= start || valueEnd || valueStart ? null : { same: true };
}
/* validar  */
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

ValidatorWindowsStartVisit(control: FormControl): { [s: string]: boolean } {
  let formulario: any = this;
  if (control.value === formulario.controls['deliveryWindowVisitEnd'].value) {
      return {
          confirmar: true,
      };
  } else if (control.value > formulario.controls['deliveryWindowVisitEnd'].value) {
      return {
          sutrast: true,
      };
  }
  return null;
}

ValidatorWindowsEndVisit(control: FormControl): { [s: string]: boolean } {
  let formulario: any = this;
  if (control.value < formulario.controls['deliveryWindowVisitStart'].value) {
      return {
          sutrast: true,
      };
  } else if (
      control.value === formulario.controls['deliveryWindowVisitStart'].value
  ) {
      return {
          confirmar: true,
      };
  }
  return null;
}

  getDeliveryPointType() {

    this.backendService
        .get('delivery_point_schedule_type')
        .pipe(take(1))
        .subscribe(
            (response) => {

                this.loadingSchedule = true;

                this.type = response.data;

                console.log(this.type, 'this.type');

                if (this.point.id.length > 0) {
                  
                    this.pointForm
                        .get('deliveryPointScheduleTypeId')
                        .setValue(
                            this.point.deliveryPointScheduleTypeId
                                ? this.point.deliveryPointScheduleTypeId
                                : this.type[0].id,
                        );
                    this.pointForm

                        .get('deliveryPointScheduleTypeId')

                        .updateValueAndValidity();

                    if (this.pointForm.value.deliveryPointScheduleTypeId == 1) {

                        this.getDeliveryPointScheduleService();

                        this.detectChanges.detectChanges();

                    } else if (this.pointForm.value.deliveryPointScheduleTypeId == 2) {

                        this.getScheduleSpecificationService();

                        this.detectChanges.detectChanges();
                    }

                } else {

                    this.pointForm.controls['deliveryPointScheduleTypeId'].value;

                    this.pointForm

                        .get('deliveryPointScheduleTypeId')

                        .setValue(this.type[0].id);

                    this.pointForm

                        .get('deliveryPointScheduleTypeId')

                        .updateValueAndValidity();

                    this.getDeliveryPointScheduleService();
                }
                this.loadingSchedule = false;

                this.pointForm

                    .get('deliveryPointScheduleTypeId')

                    .updateValueAndValidity();

                this.detectChanges.detectChanges();
            },

            (error) => {
                this.loadingSchedule = false;
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);

                this.setTimeoutFuntion();
            },
        );
  }

   // cargar aplicar por dia horario por dia cuando es editar y se eligue el radio
   getDeliveryPointScheduleService() {
    if (this.point.id.length > 0 && this.pointForm.value.activateDeliverySchedule) {
        this.loadingSchedule = true;
        this.backendService
            .put('delivery_point_schedule_day/deliveryPoint/' + this.point.id, {
                deliveryPointScheduleTypeId: this.pointForm.value
                    .deliveryPointScheduleTypeId,
            })
            .pipe(take(1))
            .subscribe(
                (datos) => {
                    this.point.schedule = {
                        days: datos.data,
                    };
                    this.copyScheduleDay = this.point.schedule.days.slice();
                    this.pointForm
                        .get('activeScheduleMonday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 1 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleTuesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 2 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleWednesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 3 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleThursday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 4 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleFriday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 5 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSaturday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 6 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSunday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 7 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleMonday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 1 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleTuesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 2 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleWednesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 3 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleThursday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 4 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleFriday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 5 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSaturday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 6 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSunday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 7 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.loadingSchedule = false;
                    this.detectChanges.detectChanges();
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
            this.point.id.length === 0 &&
            (!this.point.schedule ||
                !this.point.schedule.days ||
                this.point.schedule.days.length > 0)
        ) {
            this.point.schedule = {
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
            this.pointForm.get('activeScheduleMonday').setValue(false);
            this.pointForm.get('activeScheduleTuesday').setValue(false);
            this.pointForm.get('activeScheduleWednesday').setValue(false);
            this.pointForm.get('activeScheduleThursday').setValue(false);
            this.pointForm.get('activeScheduleFriday').setValue(false);
            this.pointForm.get('activeScheduleSaturday').setValue(false);
            this.pointForm.get('activeScheduleSunday').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleMonday').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleTuesday').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleWednesday').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleThursday').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleFriday').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleSaturday').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleSunday').setValue(false);
        }
    }
   }

    // cargar el formulario cuando es espesificación y se eleigue el radio
    getScheduleSpecificationService() {
      if (this.point.id.length > 0 && this.pointForm.value.activateDeliverySchedule) {
          console.log('if');
          this.loadingSchedule = true;
          this.backendService
              .put(
                  'delivery_point_schedule_specification_day/deliveryPoint/' +
                      this.point.id,
                  {
                      deliveryPointScheduleTypeId: this.pointForm.value
                          .deliveryPointScheduleTypeId,
                  },
              )
              .pipe(take(1))
              .subscribe(
                  (datos) => {
                      this.point.schedule = {
                          days: datos.data,
                      };
                      this.pointForm
                          .get('activeScheduleMonday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 1 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleTuesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 2 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleWednesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 3 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleThursday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 4 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleFriday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 5 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleSaturday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 6 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleSunday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 7 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleMonday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 1 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleTuesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 2 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleWednesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 3 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleThursday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 4 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleFriday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 5 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleSaturday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 6 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleSunday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 7 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.loadingSchedule = false;
                      this.detectChanges.detectChanges();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.error.code,
                          error.error,
                      );
                  },
              );
      } else {
          console.log('else');
          if (
              this.point.id.length === 0 &&
              (!this.point.schedule ||
                  !this.point.schedule.days ||
                  this.point.schedule.days.length > 0)
          ) {
              console.log('dentro del else if');
              this.point.schedule = {
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
              this.pointForm.get('activeScheduleMonday').setValue(false);
              this.pointForm.get('activeScheduleTuesday').setValue(false);
              this.pointForm.get('activeScheduleWednesday').setValue(false);
              this.pointForm.get('activeScheduleThursday').setValue(false);
              this.pointForm.get('activeScheduleFriday').setValue(false);
              this.pointForm.get('activeScheduleSaturday').setValue(false);
              this.pointForm.get('activeScheduleSunday').setValue(false);
              this.pointForm.get('fixedDeliveryScheduleMonday').setValue(false);
              this.pointForm.get('fixedDeliveryScheduleTuesday').setValue(false);
              this.pointForm.get('fixedDeliveryScheduleWednesday').setValue(false);
              this.pointForm.get('fixedDeliveryScheduleThursday').setValue(false);
              this.pointForm.get('fixedDeliveryScheduleFriday').setValue(false);
              this.pointForm.get('fixedDeliveryScheduleSaturday').setValue(false);
              this.pointForm.get('fixedDeliveryScheduleSunday').setValue(false);
          }
      }
  }
   // aplicar horarios por default
   applyChangeScheduleVisit() {
    console.log('**** applyChangeSchedule ****');
    let data = {
        timeStart: dayTimeAsStringToSeconds(
            this.pointForm.get('deliveryWindowVisitStart').value,
        ),
        timeEnd: dayTimeAsStringToSeconds(
            this.pointForm.get('deliveryWindowVisitEnd').value,
        ),
    };

    if (this.point.id.length > 0) {

        this.backendService
            .put('apply_visit_schedule_every_day/deliveryPoint/' + this.point.id, {
                deliveryWindowVisitStart: dayTimeAsStringToSeconds(
                    this.pointForm.get('deliveryWindowVisitStart').value,
                ),
                deliveryWindowVisitEnd: dayTimeAsStringToSeconds(
                    this.pointForm.get('deliveryWindowVisitEnd').value,
                ),
            })
            .pipe(take(1))
            .subscribe(
                (data) => {
                    this.loadingVisit = true;
                    this.point.scheduleVisit = {
                        days: data.data,
                    };
                    this.pointForm
                        .get('activeScheduleMondayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 1 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleTuesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 2 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleWednesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 3 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleThursdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 4 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleFridayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 5 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSaturdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 6 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSundayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 7 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleMondayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 1 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleTuesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 2 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleWednesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 3 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleThursdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 4 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleFridayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 5 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSaturdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 6 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSundayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 7 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.loadingVisit = false;
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.REGISTRATION'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error.code,
                        error.error,
                    );
                    this.loadingVisit = false;
                },
            );
    } else {
        this.point.scheduleVisit.days.forEach((element, i) => {
            if (element.hours.length > 0) {
                element.hours = [];
                element.hours.push({
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                });
            } else {
                element.hours.push({
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                }),
                    (element.isActive = true);
            }
        });

        this.pointForm
            .get('activeScheduleMondayVisit')
            .setValue(
                this.point.scheduleVisit &&
                    this.point.scheduleVisit.days &&
                    this.point.scheduleVisit.days.find(
                        (x) => x.intDay === 1 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleTuesdayVisit')
            .setValue(
                this.point.scheduleVisit &&
                    this.point.scheduleVisit.days &&
                    this.point.scheduleVisit.days.find(
                        (x) => x.intDay === 2 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleWednesdayVisit')
            .setValue(
                this.point.scheduleVisit &&
                    this.point.scheduleVisit.days &&
                    this.point.scheduleVisit.days.find(
                        (x) => x.intDay === 3 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleThursdayVisit')
            .setValue(
                this.point.scheduleVisit &&
                    this.point.scheduleVisit.days &&
                    this.point.scheduleVisit.days.find(
                        (x) => x.intDay === 4 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleFridayVisit')
            .setValue(
                this.point.scheduleVisit &&
                    this.point.scheduleVisit.days &&
                    this.point.scheduleVisit.days.find(
                        (x) => x.intDay === 5 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleSaturdayVisit')
            .setValue(
                this.point.scheduleVisit &&
                    this.point.scheduleVisit.days &&
                    this.point.scheduleVisit.days.find(
                        (x) => x.intDay === 6 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleSundayVisit')
            .setValue(
                this.point.scheduleVisit &&
                    this.point.scheduleVisit.days &&
                    this.point.scheduleVisit.days.find(
                        (x) => x.intDay === 7 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.detectChanges.detectChanges();
    }
   }

    // cargar aplicar por dia horario por dia cuando es editar y existe
    getDeliveryPointSchedule() {
      console.log('entro a getDeliveryPointSchedule');
      if (this.point.activateDeliverySchedule) {
          this.loadingSchedule = true;
          this.backendService
              .get('delivery_point_schedule/' + this.point.id)
              .pipe(take(1))
              .subscribe(
                  (datos) => {
                      this.point.schedule = {
                          days: datos.data,
                      };
                      this.copyScheduleDay = this.point.schedule.days.slice();
                      this.pointForm
                          .get('activeScheduleMonday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 1 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleTuesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 2 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleWednesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 3 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleThursday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 4 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleFriday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 5 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleSaturday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 6 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('activeScheduleSunday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 7 && x.isActive === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleMonday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 1 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleTuesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 2 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleWednesday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 3 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleThursday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 4 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleFriday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 5 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleSaturday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 6 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.pointForm
                          .get('fixedDeliveryScheduleSunday')
                          .setValue(
                              this.point.schedule &&
                                  this.point.schedule.days &&
                                  this.point.schedule.days.find(
                                      (x) => x.intDay === 7 && x.fixedDelivery === true,
                                  )
                                  ? true
                                  : false,
                          );
                      this.loadingSchedule = false;
                      this.detectChanges.detectChanges();
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
              this.point.id.length === 0 &&
              (!this.point.schedule ||
                  !this.point.schedule.days ||
                  this.point.schedule.days.length === 0)
          ) {
              this.point.schedule = {
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
    console.log('entro a getScheduleSpecification');
    if (this.point.id.length > 0 && this.point.activateDeliverySchedule) {
        console.log('if');
        this.loadingSchedule = true;
        this.backendService
            .get('delivery_point_schedule_specification/' + this.point.id)
            .pipe(take(1))
            .subscribe(
                (datos) => {
                    this.point.schedule = {
                        days: datos.data,
                    };
                    this.copyScheduleDay = this.point.schedule.days.slice();
                    this.pointForm
                        .get('activeScheduleMonday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 1 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleTuesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 2 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleWednesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 3 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleThursday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 4 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleFriday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 5 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSaturday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 6 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSunday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 7 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleMonday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 1 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleTuesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 2 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleWednesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 3 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleThursday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 4 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleFriday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 5 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSaturday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 6 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSunday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 7 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.loadingSchedule = false;
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error.code,
                        error.error,
                    );
                },
            );
    } else {
        console.log('else');
        if (
            this.point.id.length === 0 &&
            (!this.point.schedule ||
                !this.point.schedule.days ||
                this.point.schedule.days.length === 0)
        ) {
            console.log('dentro del else if');
            this.point.schedule = {
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

 // cargar aplicar por dia horario por dia cuando es editar y existe
 getDeliveryPointScheduleVisit() {

  if (this.point.activateDeliveryVisitSchedule) {

      this.loadingVisit = true;
      this.backendService
          .get('delivery_point_visit_schedule/' + this.point.id)
          .pipe(take(1))
          .subscribe(
              (datos) => {
                  this.point.scheduleVisit = {
                      days: datos.data,
                  };
                  this.copyScheduleDay = this.point.scheduleVisit.days.slice();
                  this.pointForm
                      .get('activeScheduleMondayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 1 && x.isActive === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('activeScheduleTuesdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 2 && x.isActive === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('activeScheduleWednesdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 3 && x.isActive === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('activeScheduleThursdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 4 && x.isActive === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('activeScheduleFridayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 5 && x.isActive === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('activeScheduleSaturdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 6 && x.isActive === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('activeScheduleSundayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 7 && x.isActive === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('fixedDeliveryScheduleMondayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 1 && x.fixedDelivery === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('fixedDeliveryScheduleTuesdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 2 && x.fixedDelivery === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('fixedDeliveryScheduleWednesdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 3 && x.fixedDelivery === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('fixedDeliveryScheduleThursdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 4 && x.fixedDelivery === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('fixedDeliveryScheduleFridayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 5 && x.fixedDelivery === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('fixedDeliveryScheduleSaturdayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 6 && x.fixedDelivery === true,
                              )
                              ? true
                              : false,
                      );
                  this.pointForm
                      .get('fixedDeliveryScheduleSundayVisit')
                      .setValue(
                          this.point.scheduleVisit &&
                              this.point.scheduleVisit.days &&
                              this.point.scheduleVisit.days.find(
                                  (x) => x.intDay === 7 && x.fixedDelivery === true,
                              )
                              ? true
                              : false,
                      );
                  this.loadingVisit = false;
                  this.detectChanges.detectChanges();
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
          this.point.id.length === 0 &&
          (!this.point.scheduleVisit ||
              !this.point.scheduleVisit.days ||
              this.point.scheduleVisit.days.length === 0)
      ) {
          this.point.scheduleVisit = {
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
              this.detectChanges.detectChanges();

              this.setTimeoutFuntion();
          },
      );
}

changetime(event: any, name: string) {

    let dataForm: any = _.cloneDeep( this.point);
  
  if (event.target.value === '') {
      switch (name) {
          case 'deliveryWIndowsStart':
              this.pointForm
                  .get('deliveryWindowStart')
                  .setValue(secondsToDayTimeAsString(0));
              this.pointForm.get('deliveryWindowStart').updateValueAndValidity();
              break;
          case 'deliveryWIndowsEnd':
              this.pointForm
                  .get('deliveryWindowEnd')
                  .setValue(secondsToDayTimeAsString(86399));
              this.pointForm.get('deliveryWindowEnd').updateValueAndValidity();
              break;
          default:
              break;
      }
  } else {

    dataForm.deliveryWindowStart = dayTimeAsStringToSeconds(
        this.pointForm.value.deliveryWindowStart,
    );

    dataForm.deliveryWindowEnd = dayTimeAsStringToSeconds(
        this.pointForm.value.deliveryWindowEnd,
    );

    this.clients.emit( dataForm );

      this.pointForm.get('deliveryWindowStart').updateValueAndValidity();
      this.pointForm.get('deliveryWindowEnd').updateValueAndValidity();
  }
}

    /* change de radios eliveryPointScheduleTypeId */
    changedeliveryPointScheduleTypeId() {

        let dataForm: any = _.cloneDeep( this.point);
        
      if (this.pointForm.value.deliveryPointScheduleTypeId == 1) {
        console.log('1 changedeliveryPointScheduleTypeId');
          this.getDeliveryPointScheduleService();
      } else {
        console.log('2 changedeliveryPointScheduleTypeId');
          this.getScheduleSpecificationService();
      }

      dataForm.activateDeliverySchedule = this.pointForm.value.activateDeliverySchedule;

      dataForm.deliveryPointScheduleTypeId =this.pointForm.value.deliveryPointScheduleTypeId;

      this.clients.emit( dataForm);
  }

  /* dibuja el arreglo por dia se le pasa el dia y el separa ese en espesifico */
  sortBy(prop: number) {
    //return this.point.schedule.days.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
    return this.point.schedule.days.filter((x) => x.intDay == prop);
}

secondToTime(value) {
  return secondsToDayTimeAsString(value);
}

validtimeStart(hours) {
  return hours.timeStart > hours.timeEnd || hours.timeStart === -1 ? true : false;
}

validtimeEnd(hours) {
  return hours.timeEnd < hours.timeStart || hours.timeEnd === -1 ? true : false;
}

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

  //añadir por dia check

  changeScheduleDay(value, dayNumber, fixedDelivery) {

    let schedule = this.point.schedule.days.find((x) => x.intDay == dayNumber);

    if (value) {
        if (this.point.id.length > 0) {
            this.backendService
                .put('delivery_point_schedule_day/' + schedule.id, {
                    isActive: value,
                    fixedDelivery: fixedDelivery,
                })
                .pipe(take(1))
                .subscribe((response) => {
                    schedule.isActive = value;
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    /* if (!schedule.hours || (schedule.hours && schedule.hours.length === 0)) {
                    this.addScheduleToDayNew(dayNumber, schedule);
                } */
                    this.detectChanges.detectChanges();
                });
        } else {
            if (schedule) {
                console.log('else if cuando es crear');
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
                console.log('else else cuando es crear');
                this.point.schedule.days.push({
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

            this.detectChanges.detectChanges();
        }
    } else {
        if (this.point.id.length > 0) {
            this.backendService
                .put('delivery_point_schedule_day/' + schedule.id, {
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
                    this.detectChanges.detectChanges();
                });
        } else {
            schedule.isActive = value;
            schedule.fixedDelivery = fixedDelivery;
            schedule.hours = [];
            this.detectChanges.detectChanges();
        }
    }
}

// lade uno nuevo al arrary
addScheduleToDay(intDay: number, item: any) {

  let schedule = this.point.schedule.days.find((x) => x.intDay == intDay);

  schedule.hours.push({
      timeStart: -1,
      timeEnd: -1,
  });
}

/* elimina el horaio */

deleteHours(intDay, hours) {

  let schedule = this.point.schedule.days.find((x) => x.intDay == intDay);

  if (hours.id > 0) {

      this.backendService
          .delete('delivery_point_schedule_hour/' + hours.id)
          .pipe(take(1))
          .subscribe(
              (response) => {
                  const index = schedule.hours.indexOf(hours);
                  schedule.hours.splice(index, 1);
                  this.toastService.displayWebsiteRelatedToast(
                      this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                      this.translate.instant('GENERAL.ACCEPT'),
                  );
                  this.detectChanges.detectChanges();
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

      this.detectChanges.detectChanges();
      
  }
}

/* edita el horaio */

changeHour(value, hour: any, day, time: string, i: number) {

  const index = day.hours.indexOf(hour);

  if (this.point.id.length > 0) {

      if (time === 'start') {

          day.hours[index].timeStart = dayTimeAsStringToSeconds(value);

      } else {

          day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
      }

      if (this.validIntervalHours(hour, day)) {
          console.log(this.validIntervalHours(hour, day));
          return;
      }

      if (hour.id > 0) {
          if (day.hours[index].timeStart >= 0 && day.hours[index].timeEnd >= 0) {
              this.backendService
                  .put('delivery_point_schedule_hour/' + hour.id, day.hours[index])
                  .pipe(take(1))
                  .subscribe(
                      (response) => {
                          this.toastService.displayWebsiteRelatedToast(
                              this.translate.instant(
                                  'CONFIGURATIONS.UPDATE_NOTIFICATIONS',
                              ),
                              this.translate.instant('GENERAL.ACCEPT'),
                          );
                          this.detectChanges.detectChanges();
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
          let schedule = this.point.schedule.days.find((x) => x.intDay == day.intDay);
          console.log(schedule, 'schedule else post');

          if (
              day.hours[index].timeStart >= 0 &&
              day.hours[index].timeEnd >= 0 &&
              day.hours[index].timeStart != -1 &&
              day.hours[index].timeEnd != -1
          ) {
              this.backendService
                  .post('delivery_point_schedule_hour', {
                      deliveryPointScheduleDayId: schedule.id,
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

                          this.detectChanges.detectChanges();
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
      this.detectChanges.detectChanges();
  }
}

/* añadir especiicacion  */

addScheduleSpecification(intDay: number, item: any) {
  let schedule = this.point.schedule.days.find((x) => x.intDay == intDay);

  if (schedule.hours.length > 0) {
      
      schedule.hours.push({
          companyTimeZoneId: '',
          default: false,
          id: 0,
      });
  } else {
      
      schedule.hours.push({
          companyTimeZoneId: '',
          default: true,
          id: 0,
      });
  }
}

redirect(){
        
  this.router.navigate(['management/client-settings']);
}

validSpecificationDay(hour, day) {
  let index = day.hours.indexOf(hour);

  let exist = false;

  day.hours.forEach((element, i) => {
      if (index != i && !exist) {
          return (exist = element.id > 0 ? false : true);
      } else if (hour.id === 0) {
          return (exist = false);
      } else {
          return (exist =
              hour.id === 0 && element.companyTimeZoneId == hour.companyTimeZoneId
                  ? true
                  : false);
      }
  });

  return exist;
}

 // default radio
 changeDefaultFraja(event: any, hours: any, day: any) {
  const index = day.hours.indexOf(hours);

  let change = day.hours.find((x) => x.default === event);

  if (this.point.id.length > 0) {
      this.backendService
          .put('delivery_point_schedule_specification_hour/' + hours.id, {
              id: hours.id,
              companyTimeZoneId: hours.companyTimeZoneId,
              default: event,
          })
          .pipe(take(1))
          .subscribe(
              (response) => {
                  if (change) {
                      day.hours.forEach((element, i) => {
                          if (element.default == true) {
                              element.default = false;
                          }
                      });
                  }

                  day.hours[index].default = event;
                  this.toastService.displayWebsiteRelatedToast(
                      this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                      this.translate.instant('GENERAL.ACCEPT'),
                  );
                  this.error = false;
                  this.detectChanges.detectChanges();
              },
              (error) => {
                  this.toastService.displayHTTPErrorToast(
                      error.error.code,
                      error.error,
                  );
                  this.detectChanges.detectChanges();
              },
          );
  } else {
      if (change) {
          let changeFalse = day.hours.indexOf(change);

          day.hours[changeFalse].default = false;
      }

      day.hours[index].default = event;

      this.detectChanges.detectChanges();
  }
}

  /* Validate radio */

  validSpecificationService(hour, day) {
    let index = day.hours.indexOf(hour);

    let exist = false;

    day.hours.forEach((element, i) => {
        if (index !== i && !exist) {
            exist = element.companyTimeZoneId == hour.companyTimeZoneId ? true : false;
        }
    });

    return exist;
}

//delete franja horaria
deleteSpecification(intDay, hours) {
  let schedule = this.point.schedule.days.find((x) => x.intDay == intDay);
  if (hours.id > 0) {
      this.backendService
          .delete('delivery_point_schedule_specification_hour/' + hours.id)
          .pipe(take(1))
          .subscribe(
              (response) => {
                  const index = schedule.hours.indexOf(hours);
                  schedule.hours.splice(index, 1);
                  this.toastService.displayWebsiteRelatedToast(
                      this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                      this.translate.instant('GENERAL.ACCEPT'),
                  );
                  this.error = false;
                  this.detectChanges.detectChanges();
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
      this.error = false;
      this.detectChanges.detectChanges();
  }
}


 //funcion select franja
 changeSelectShedule(event: any, hours: any, day: any, target: any) {
  const index = day.hours.indexOf(hours);

  const exist = day.hours.find((x) => x.companyTimeZoneId === Number(event));

  let specification = day.hours.find((x) => x.id == hours.id);

  //si hay uno igual ejemplo

  let returnEqual = false;
  if (day.hours.length > 0) {
      day.hours.forEach((element, i) => {
          if ('' + element.companyTimeZoneId === '' + event) {
              this.error = true;
              returnEqual = true;
              //  day.hours[i].companyTimeZoneId = element.companyTimeZoneId;

              console.log(
                  'este es el que se está moviendo ' + target,
                  $('#' + target),
              );

              $('#' + target + ' option[value=""]');

              $('#' + target).prop('value', hours.companyTimeZoneId);

              this.detectChanges.detectChanges();
          }
      });
  }

  if (returnEqual) return;

  if (this.point.id.length > 0) {
      if (!exist) {
          if (specification.id > 0 && event.length > 0) {
              this.updateSpecification(hours, day, event);
          } else if (event.length > 0) {
              this.createSpeciticafion(hours, day, event);
          }
      } else {
          this.error = true;
          day.hours[index].companyTimeZoneId = event;
          this.detectChanges.detectChanges();
          //this.validSpecificationService(hours, day);
      }
  } else {
      const dist = day.hours.find((x) => x.companyTimeZoneId == Number(event));
      if (!dist) {
          day.hours[index].companyTimeZoneId = event;
          this.error = false;
          this.detectChanges.detectChanges();
      } else {
          day.hours[index].companyTimeZoneId = event;
          return (this.error = true);
      }

      this.detectChanges.detectChanges();
  }
}

//servicio de crear especificación uno a uno
createSpeciticafion(hours: any, day: any, event: any) {
  const index = day.hours.indexOf(hours);

  this.backendService
      .post('delivery_point_schedule_specification_hour', {
          deliveryPointScheduleSpecificationDayId: day.id,

          companyTimeZoneId: event,

          default: hours.default,
      })
      .pipe(take(1))
      .subscribe(
          (response) => {
              day.hours[index].id = response.data.id;

              day.hours[index].companyTimeZoneId = response.data.companyTimeZoneId;

              day.hours[index].default = response.data.default;

              this.toastService.displayWebsiteRelatedToast(
                  this.translate.instant('GENERAL.REGISTRATION'),
                  this.translate.instant('GENERAL.ACCEPT'),
              );
              this.error = false;
              this.detectChanges.detectChanges();
          },
          (error) => {
              this.toastService.displayHTTPErrorToast(error.error.code, error.error);
          },
      );
}

//editar especificación uno a uno
updateSpecification(hours: any, day: any, event: any) {
  this.backendService
      .put('delivery_point_schedule_specification_hour/' + hours.id, {
          id: hours.id,

          companyTimeZoneId: event,

          default: hours.default,
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

              this.detectChanges.detectChanges();
          },
          (error) => {
              this.toastService.displayHTTPErrorToast(error.error.code, error.error);

              this.detectChanges.detectChanges();
          },
      );
}

 // change active fixed
 changeSpecificationSchedule(value, dayNumber, fixedDelivery) {
  let schedule = this.point.schedule.days.find((x) => x.intDay == dayNumber);

  if (value) {
      if (this.point.id.length > 0) {
          this.backendService
              .put('delivery_point_schedule_specification_day/' + schedule.id, {
                  isActive: value,

                  fixedDelivery: fixedDelivery,
              })
              .pipe(take(1))
              .subscribe(
                  (response) => {
                      schedule.isActive = value;

                      this.toastService.displayWebsiteRelatedToast(
                          this.translate.instant(
                              'CONFIGURATIONS.UPDATE_NOTIFICATIONS',
                          ),
                          this.translate.instant('GENERAL.ACCEPT'),
                      );

                      this.detectChanges.detectChanges();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.error.code,
                          error.error,
                      );
                  },
              );
      } else {
          if (schedule) {
              schedule.isActive = value;

              schedule.fixedDelivery = fixedDelivery;

              if (schedule.hours && schedule.hours.length == 0) {
                  schedule.hours = [];
              }
          } else {
              this.point.schedule.days.push({
                  intDay: dayNumber,
                  isActive: value,
                  fixedDelivery: fixedDelivery,
                  id: 0,
                  hours: [],
              });
          }

          this.detectChanges.detectChanges();
      }
  } else {
      if (this.point.id.length > 0) {
          this.backendService
              .put('delivery_point_schedule_specification_day/' + schedule.id, {
                  isActive: value,

                  fixedDelivery: fixedDelivery,
              })
              .pipe(take(1))
              .subscribe(
                  (response) => {
                      schedule.isActive = value;

                      this.toastService.displayWebsiteRelatedToast(
                          this.translate.instant(
                              'CONFIGURATIONS.UPDATE_NOTIFICATIONS',
                          ),
                          this.translate.instant('GENERAL.ACCEPT'),
                      );

                      this.detectChanges.detectChanges();
                  },
                  (error) => {
                      this.toastService.displayHTTPErrorToast(
                          error.error.code,
                          error.error,
                      );
                  },
              );
      } else {
          schedule.isActive = value;
          schedule.fixedDelivery = fixedDelivery;
          schedule.hours = [];
          this.detectChanges.detectChanges();
      }
  }
}

changetimeVisit(event: any, name: string) {

    let dataForm: any = _.cloneDeep( this.point);

    console.log(event, name, 'event: any, name: string');
    if (event.target.value === '') {
        switch (name) {
            case 'deliveryWindowVisitStart':
                this.pointForm
                    .get('deliveryWindowVisitStart')
                    .setValue(secondsToDayTimeAsString(0));
                this.pointForm.get('deliveryWindowVisitStart').updateValueAndValidity();
                break;
            case 'deliveryWindowVisitEnd':
                this.pointForm
                    .get('deliveryWindowVisitEnd')
                    .setValue(secondsToDayTimeAsString(86399));
                this.pointForm.get('deliveryWindowVisitEnd').updateValueAndValidity();
                break;
            default:
                break;
        }
    } else {
        dataForm.deliveryWindowVisitStart = dayTimeAsStringToSeconds(
            this.pointForm.value.deliveryWindowVisitStart,
        );
    
        dataForm.deliveryWindowVisitEnd = dayTimeAsStringToSeconds(
            this.pointForm.value.deliveryWindowVisitEnd,
        );
        this.clients.emit(  dataForm);
        this.pointForm.get('deliveryWindowVisitStart').updateValueAndValidity();
        this.pointForm.get('deliveryWindowVisitEnd').updateValueAndValidity();
    }
}

  /* change de radios eliveryPointScheduleTypeId */
  changedeliveryPointScheduleTypeVisitId(event: any) {

    let dataForm: any = _.cloneDeep( this.point);

    dataForm.activateDeliveryVisitSchedule = this.pointForm.value.activateDeliveryVisitSchedule;

    this.clients.emit( dataForm );
   
    this.getDeliveryPointScheduleVisit();

    this.getDeliveryPointScheduleServiceVisit();

 


}

// cargar aplicar por dia horario por dia cuando es editar y se eligue el radio visit
getDeliveryPointScheduleServiceVisit() {
    console.log('getDeliveryPointScheduleServiceVisit');

    if (
        this.point.id.length > 0 &&
        this.pointForm.value.activateDeliveryVisitSchedule
    ) {
        this.loadingVisit = true;
        this.backendService
            .put('delivery_point_visit_schedule_day/deliveryPoint/' + this.point.id, {
                deliveryPointVisitScheduleTypeId: this.pointForm.value
                    .deliveryPointVisitScheduleTypeId,
            })
            .pipe(take(1))
            .subscribe(
                (datos) => {
                    this.point.scheduleVisit = {
                        days: datos.data,
                    };
                    this.copyScheduleDay = this.point.scheduleVisit.days.slice();
                    this.pointForm
                        .get('activeScheduleMondayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 1 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleTuesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 2 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleWednesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 3 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleThursdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 4 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleFridayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 5 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSaturdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 6 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSundayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 7 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleMondayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 1 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleTuesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 2 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleWednesdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 3 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleThursdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 4 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleFridayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 5 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSaturdayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 6 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSundayVisit')
                        .setValue(
                            this.point.scheduleVisit &&
                                this.point.scheduleVisit.days &&
                                this.point.scheduleVisit.days.find(
                                    (x) => x.intDay === 7 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.loadingVisit = false;
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.error.code,
                        error.error,
                    );
                },
            );
    } else {
        console.log('else');
        if (
            this.point.id.length === 0 &&
            (!this.point.scheduleVisit ||
                !this.point.scheduleVisit.days ||
                this.point.scheduleVisit.days.length > 0)
        ) {
            this.point.scheduleVisit = {
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
            this.pointForm.get('activeScheduleMondayVisit').setValue(false);
            this.pointForm.get('activeScheduleTuesdayVisit').setValue(false);
            this.pointForm.get('activeScheduleWednesdayVisit').setValue(false);
            this.pointForm.get('activeScheduleThursdayVisit').setValue(false);
            this.pointForm.get('activeScheduleFridayVisit').setValue(false);
            this.pointForm.get('activeScheduleSaturdayVisit').setValue(false);
            this.pointForm.get('activeScheduleSundayVisit').setValue(false);

            this.pointForm.get('fixedDeliveryScheduleMondayVisit').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleTuesdayVisit').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleWednesdayVisit').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleThursdayVisit').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleFridayVisit').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleSaturdayVisit').setValue(false);
            this.pointForm.get('fixedDeliveryScheduleSundayVisit').setValue(false);
        }
    }
}

changeScheduleDayVisit(value, dayNumber, fixedDelivery) {
    let schedule = this.point.scheduleVisit.days.find((x) => x.intDay == dayNumber);

    if (value) {
        if (this.point.id.length > 0) {
            this.backendService
                .put('delivery_point_visit_schedule_day/' + schedule.id, {
                    isActive: value,
                    fixedDelivery: fixedDelivery,
                })
                .pipe(take(1))
                .subscribe((response) => {
                    schedule.isActive = value;
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    /* if (!schedule.hours || (schedule.hours && schedule.hours.length === 0)) {
                    this.addScheduleToDayNew(dayNumber, schedule);
                } */
                    this.detectChanges.detectChanges();
                });
        } else {
            if (schedule) {
                console.log('else if cuando es crear');
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
                console.log('else else cuando es crear');
                this.point.scheduleVisit.days.push({
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

            this.detectChanges.detectChanges();
        }
    } else {
        if (this.point.id.length > 0) {
            this.backendService
                .put('delivery_point_visit_schedule_day/' + schedule.id, {
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
                    this.detectChanges.detectChanges();
                });
        } else {
            schedule.isActive = value;
            schedule.fixedDelivery = fixedDelivery;
            schedule.hours = [];
            this.detectChanges.detectChanges();
        }
    }
}

/* cambiar hora sea crear o editar */
changeHourVisit(value, hour: any, day, time: string, i: number) {
    const index = day.hours.indexOf(hour);

    if (this.point.id.length > 0) {
        if (time === 'start') {
            day.hours[index].timeStart = dayTimeAsStringToSeconds(value);
        } else {
            day.hours[index].timeEnd = dayTimeAsStringToSeconds(value);
        }

        if (hour.id > 0) {
            if (day.hours[index].timeStart >= 0 && day.hours[index].timeEnd >= 0) {
                this.backendService
                    .put(
                        'delivery_point_visit_schedule_hour/' + hour.id,
                        day.hours[index],
                    )
                    .pipe(take(1))
                    .subscribe(
                        (response) => {
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant(
                                    'CONFIGURATIONS.UPDATE_NOTIFICATIONS',
                                ),
                                this.translate.instant('GENERAL.ACCEPT'),
                            );
                            this.detectChanges.detectChanges();
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
            let schedule = this.point.scheduleVisit.days.find(
                (x) => x.intDay == day.intDay,
            );
            console.log(schedule, 'schedule else post');

            if (
                day.hours[index].timeStart >= 0 &&
                day.hours[index].timeEnd >= 0 &&
                day.hours[index].timeStart != -1 &&
                day.hours[index].timeEnd != -1
            ) {
                this.backendService
                    .post('delivery_point_visit_schedule_hour', {
                        deliveryPointVisitScheduleDayId: schedule.id,
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

                            this.detectChanges.detectChanges();
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

        this.detectChanges.detectChanges();
    }
}

addScheduleToDayVisit(intDay: number, item: any) {
    let schedule = this.point.scheduleVisit.days.find((x) => x.intDay == intDay);

    schedule.hours.push({
        timeStart: -1,
        timeEnd: -1,
    });
}

deleteHoursVisit(intDay, hours) {
    let schedule = this.point.scheduleVisit.days.find((x) => x.intDay == intDay);
    if (hours.id > 0) {
        this.backendService
            .delete('delivery_point_visit_schedule_hour/' + hours.id)
            .pipe(take(1))
            .subscribe(
                (response) => {
                    const index = schedule.hours.indexOf(hours);
                    schedule.hours.splice(index, 1);
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.detectChanges.detectChanges();
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
        this.detectChanges.detectChanges();
    }
}

/* end schedule visit */

sortByVisit(prop: number) {
    //return this.point.schedule.days.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
    return this.point.scheduleVisit.days.filter((x) => x.intDay == prop);
}

 // aplicar horarios por default
 applyChangeSchedule() {
    console.log('**** applyChangeSchedule ****');
    let data = {
        timeStart: dayTimeAsStringToSeconds(
            this.pointForm.get('deliveryWindowStart').value,
        ),
        timeEnd: dayTimeAsStringToSeconds(
            this.pointForm.get('deliveryWindowEnd').value,
        ),
    };

    if (this.point.id.length > 0) {
        this.backendService
            .put('apply_schedule_every_day/deliveryPoint/' + this.point.id, {
                deliveryWindowStart: dayTimeAsStringToSeconds(
                    this.pointForm.get('deliveryWindowStart').value,
                ),
                deliveryWindowEnd: dayTimeAsStringToSeconds(
                    this.pointForm.get('deliveryWindowEnd').value,
                ),
            })
            .pipe(take(1))
            .subscribe(
                (data) => {
                    this.loadingSchedule = true;
                    this.point.schedule = {
                        days: data.data,
                    };
                    this.pointForm
                        .get('activeScheduleMonday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 1 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleTuesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 2 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleWednesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 3 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleThursday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 4 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleFriday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 5 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSaturday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 6 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('activeScheduleSunday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 7 && x.isActive === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleMonday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 1 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleTuesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 2 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleWednesday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 3 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleThursday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 4 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleFriday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 5 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSaturday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 6 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.pointForm
                        .get('fixedDeliveryScheduleSunday')
                        .setValue(
                            this.point.schedule &&
                                this.point.schedule.days &&
                                this.point.schedule.days.find(
                                    (x) => x.intDay === 7 && x.fixedDelivery === true,
                                )
                                ? true
                                : false,
                        );
                    this.loadingSchedule = false;
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.REGISTRATION'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.detectChanges.detectChanges();
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
        this.point.schedule.days.forEach((element, i) => {
            if (element.hours.length > 0) {
                element.hours = [];
                element.hours.push({
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                });
            } else {
                element.hours.push({
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                }),
                    (element.isActive = true);
            }
        });

        this.pointForm
            .get('activeScheduleMonday')
            .setValue(
                this.point.schedule &&
                    this.point.schedule.days &&
                    this.point.schedule.days.find(
                        (x) => x.intDay === 1 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleTuesday')
            .setValue(
                this.point.schedule &&
                    this.point.schedule.days &&
                    this.point.schedule.days.find(
                        (x) => x.intDay === 2 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleWednesday')
            .setValue(
                this.point.schedule &&
                    this.point.schedule.days &&
                    this.point.schedule.days.find(
                        (x) => x.intDay === 3 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleThursday')
            .setValue(
                this.point.schedule &&
                    this.point.schedule.days &&
                    this.point.schedule.days.find(
                        (x) => x.intDay === 4 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleFriday')
            .setValue(
                this.point.schedule &&
                    this.point.schedule.days &&
                    this.point.schedule.days.find(
                        (x) => x.intDay === 5 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleSaturday')
            .setValue(
                this.point.schedule &&
                    this.point.schedule.days &&
                    this.point.schedule.days.find(
                        (x) => x.intDay === 6 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.pointForm
            .get('activeScheduleSunday')
            .setValue(
                this.point.schedule &&
                    this.point.schedule.days &&
                    this.point.schedule.days.find(
                        (x) => x.intDay === 7 && x.isActive === true,
                    )
                    ? true
                    : false,
            );
        this.detectChanges.detectChanges();
    }
}

validateAbsolute() {
    if (this.pointForm.value.deliveryPointScheduleTypeId == 1) {
        return this.disabledBtnDaySchedule();
    } else if (this.pointForm.value.deliveryPointScheduleTypeId == 2) {
        return this.disabledBtnSpecification();
    }
}

/* Validación anterior  */
disabledBtnDaySchedule() {
    let disabled = false;

    if (this.point.schedule && this.point.schedule.days) {
        this.point.schedule.days.forEach((element, i) => {
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






addPoint(point: Point) {
    this.facade.addPoint(point);
}

updatePoint(obj: [string, Partial<Point>]) {
    this.facade.editPoint(obj[0], obj[1]);
}

isFormInvalid(): boolean {
    if (!this.point.id || this.point.id.length === 0) {
        this.clients.emit( this.pointForm.value );
    }
    
    return !this.pointForm.valid;
}

submit() {
    this.loadingService.showLoading();

    this.pointForm.value.created_at = objectToString(this.pointForm.value.created_at);
    this.pointForm.value.disabled_at = objectToString(this.pointForm.value.disabled_at);

    let dataForm = _.cloneDeep(this.pointForm.value);

    let time: number =
        this.pointForm.value.hours * 3600 +
        this.pointForm.value.minutes * 60 +
        this.pointForm.value.seconds;

    let timeDelay: number =
        this.pointForm.value.hours_delay * 3600 +
        this.pointForm.value.minutes_delay * 60 +
        this.pointForm.value.seconds_delay;

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
        this.pointForm.value.deliveryWindowStart,
    );

    dataForm.deliveryWindowEnd = dayTimeAsStringToSeconds(
        this.pointForm.value.deliveryWindowEnd,
    );

    //visit
    dataForm.deliveryWindowVisitStart = dayTimeAsStringToSeconds(
        this.pointForm.value.deliveryWindowVisitStart,
    );

    dataForm.deliveryWindowVisitEnd = dayTimeAsStringToSeconds(
        this.pointForm.value.deliveryWindowVisitEnd,
    );
    //en visit

    dataForm.serviceTime =
        this.pointForm.value.serviceTimeMinute * 60 +
        this.pointForm.value.serviceTimeSeconds;

    dataForm.agentUserId =
        dataForm.agentUserId === null || dataForm.agentUserId === ''
            ? null
            : dataForm.agentUserId;

    dataForm.leadTime = time;
    dataForm.allowedDelayTime = timeDelay;
    dataForm.deliveryPointServiceType = this.pointForm.value.deliveryPointServiceType;
    dataForm.images = this.point.images;
    dataForm.deliveryZoneSpecificationType = this.pointForm.value.deliveryZoneSpecificationType;
    /* dataForm.deliveryZoneSpecificationType =this.getSpecificationVAlue(); */

    

    if (
        this.point.id.length === 0 &&
        this.point.schedule &&
        this.point.schedule.days &&
        this.point.schedule.days.length > 0 &&
        this.pointForm.value.activateDeliverySchedule
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
        this.pointForm.value.activateDeliveryVisitSchedule
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

    if (!this.pointForm.value.activateDeliveryVisitSchedule) {
        dataForm.scheduleVisit = [];
    }
    //end visit

    if (!this.pointForm.value.activateDeliverySchedule) {
        dataForm.schedule = [];
        dataForm.scheduleSpecification = [];
        dataForm.deliveryPointScheduleTypeId = null;
    }

  

    if (this.pointForm.invalid) {
        this.toastService.displayWebsiteRelatedToast('The point is not valid'),
            this.translate.instant('GENERAL.ACCEPT');
        this.loadingService.hideLoading();
    } else {
        if (!this.point.id || this.point.id === null || this.point.id === '') {
           
            this.addPoint(dataForm);

            this.facade.added$.pipe(take(2)).subscribe(
                (data) => {
                    if (data) {
                        console.log(data,'data')
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
                    console.log(data,'data update')
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

changeSelectName(id:number) {
    
    switch (id) {
        case 1:
            return 'Horario por día';
            break;
    
        default:
            return 'Especificación horaria';
            break;
    }
    
}


}
