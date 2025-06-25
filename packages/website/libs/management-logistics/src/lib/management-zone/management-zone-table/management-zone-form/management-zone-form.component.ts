import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import {
    FormControl,
    FormGroupDirective,
    NgForm,
    FormBuilder,
    Validators,
    FormGroup,
} from '@angular/forms';
import {
    ToastService,
    secondsToDayTimeAsString,
    dayTimeAsStringToSeconds,
    DeliveryZoneMessages,
} from '@optimroute/shared';
import { Zone } from '@optimroute/backend';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import * as _ from 'lodash';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

declare function init_plugins();
class Matcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null,
    ): boolean {
        //const isSubmitted = form && form.submitted;
        return control.dirty && form.invalid;
    }
}

@Component({
    selector: 'easyroute-management-zone-form',
    templateUrl: './management-zone-form.component.html',
    styleUrls: ['./management-zone-form.component.scss'],
})
export class ManagementZoneFormComponent implements OnInit {
    FormGroup: FormGroup;
    matcher = new ErrorStateMatcher();
    end: string;
    start: string;
    data: any;
    deliveryZone_messages: any;
    costDistance: string = 'costDistance';
    costDuration: string = 'costDuration';
    CostVehicleWaitTime: string = 'CostVehicleWaitTime';
    explorationLevel: string = 'explorationLevel';

    titleTranslate: string;

    constructor(
        private toastService: ToastService,
        private fb: FormBuilder,
        private facade: StateDeliveryZonesFacade,
        public activeModal: NgbActiveModal,
        private _translate: TranslateService
    ) {}

    ngOnInit() {
        this.initForm(this.data);
        
        setTimeout(() => {
            init_plugins();
        }, 1000);  

        console.log(this.data, 'datos de llegada del modal');
    }

    async initForm(data: any) {
        let totalSeconds = data.zone.settingsOptimizationParametersMaxDelayTime
            ? data.zone.settingsOptimizationParametersMaxDelayTime
            : 0;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        this.FormGroup = this.fb.group(
            {
                id: [data.zone.id || ''],
                name: [
                    data.zone.name,
                    [
                        Validators.required,
                        Validators.maxLength(50),
                    ],
                ],
                color: [data.zone.color, [Validators.required]],
               
                settingsForcedeparturetime: [data.zone.settingsForcedeparturetime],
                settingsIgnorecapacitylimit: [data.zone.settingsIgnorecapacitylimit],
                settingsUseallvehicles: [data.zone.settingsUseallvehicles],
                settingsOptimizationParametersCostDistance: [
                    data.zone.settingsOptimizationParametersCostDistance
                        ? data.zone.settingsOptimizationParametersCostDistance
                        : 0,
                ],
                settingsOptimizationParametersCostDuration: [
                    data.zone.settingsOptimizationParametersCostDuration
                        ? data.zone.settingsOptimizationParametersCostDuration
                        : 0,
                ],
                settingsOptimizationParametersCostVehicleWaitTime: [
                    data.zone.settingsOptimizationParametersCostVehicleWaitTime
                        ? data.zone.settingsOptimizationParametersCostVehicleWaitTime
                        : 0,
                ],
                settingsExplorationlevel: [
                    data.zone.settingsExplorationlevel
                        ? data.zone.settingsExplorationlevel
                        : 1,
                ],
                order: [data.zone.order, [Validators.required, Validators.min(1)]],
                showInWeb:['']
                /*  hours: [hours],
        minutes:[minutes],
        seconds:[seconds] */
            },
            // { validator: this.checkStartAndEndTime }
        );

        let deliveryZone_messages = new DeliveryZoneMessages();
        this.deliveryZone_messages = deliveryZone_messages.getDeliveryZoneMessages();
    }

    closeDialog(value: any) {
        this.activeModal.close(value);
    }

    isFormInvalid(): boolean {
        return !this.FormGroup.valid;
    }
    updateSliderValue(event: any, name: string) {
        switch (name) {
            case 'costDistance':
                this.data.zone.settingsOptimizationParametersCostDistance = event;
                break;

            case 'costDuration':
                this.data.zone.settingsOptimizationParametersCostDuration = event;
                break;

            case 'CostVehicleWaitTime':
                this.data.zone.settingsOptimizationParametersCostVehicleWaitTime = event;
                break;

            case 'explorationLevel':
                this.data.zone.settingsExplorationlevel = event;
                break;

            default:
                break;
        }
    }

    submit() {
        /* this.FormGroup.value.settingsDeliveryScheduleEnd;
    this.FormGroup.value.settingsDeliveryScheduleStart; */
        let time: number =
            this.FormGroup.value.hours * 3600 +
            this.FormGroup.value.minutes * 60 +
            this.FormGroup.value.seconds;
        let dataform = _.cloneDeep(this.FormGroup.value);

        delete dataform.hours;
        delete dataform.minutes;
        delete dataform.seconds;

        dataform.settingsOptimizationParametersMaxDelayTime = time;
        dataform.showInWeb = true
       // dataform.deliveryzone = dataform;
        /* dataform.settingsDeliveryScheduleStart = dayTimeAsStringToSeconds(this.FormGroup.value.settingsDeliveryScheduleStart);
    dataform.settingsDeliveryScheduleEnd = dayTimeAsStringToSeconds(this.FormGroup.value.settingsDeliveryScheduleEnd); */
        if (this.isFormInvalid()) {
            this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
                this._translate.instant('GENERAL.ACCEPT');
        } else {
            if (!this.data.zone.id || this.data.zone.id === null) {
                this.addZone(dataform);
                this.facade.added$.subscribe((data) => {
                    if (data) {
                        this.closeDialog([true, this.FormGroup.value]);
                    }
                });
            } else {
                this.updateZone([this.data.zone.id, dataform]);
                this.facade.updated$.subscribe((data) => {
                    if (data) {
                        this.closeDialog([true, this.FormGroup.value]);
                    }
                });
            }
        }
    }

    addZone(zone: Zone) {
        this.facade.addDeliveryZone(zone);
    }

    updateZone(obj: [string, Partial<Zone>]) {
        this.facade.editDeliveryZone(obj[0], obj[1]);
    }

    checkStartAndEndTime(group: FormGroup) {
        let start = dayTimeAsStringToSeconds(
            group.controls.settingsDeliveryScheduleStart.value,
        );
        let end = dayTimeAsStringToSeconds(
            group.controls.settingsDeliveryScheduleEnd.value,
        );
        return end >= start ? null : { same: true };
    }
}
