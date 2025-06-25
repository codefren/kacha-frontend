import { TranslateService } from '@ngx-translate/core';
import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    secondsToDayTimeAsString,
    dayTimeAsStringToSeconds,
    ToastService,
} from '@optimroute/shared';

@Component({
    selector: 'easyroute-route-delivery-schedule',
    templateUrl: './route-delivery-schedule.component.html',
    styleUrls: ['./route-delivery-schedule.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDeliveryScheduleComponent implements OnInit {
    @Input() deliveryScheduleStart: number;
    @Input() deliveryScheduleEnd: number;
    @Input() forceDeparture: boolean;

    start: string;
    end: string;

    @Output() updateDeliveryScheduleValue = new EventEmitter<{
        startOrEnd: string;
        value: number;
    }>();
    @Output() updateToggleForceDepartureValue = new EventEmitter<any>();

    updateDeliverySchedule(startOrEnd: string) {
        const start = dayTimeAsStringToSeconds(this.start);
        const end = dayTimeAsStringToSeconds(this.end);
        if (start < end) {
            if (startOrEnd === 'start') {
                let value = -1;
                if (this.start !== '00:00') {
                    value = start;
                }
                this.updateDeliveryScheduleValue.emit({
                    startOrEnd,
                    value: value,
                });
            } else {
                let value = -1;
                if (this.end !== '23:59') {
                    value = end;
                }
                this.updateDeliveryScheduleValue.emit({
                    startOrEnd,
                    value: value,
                });
            }
        } else {
            this.openNotValidSnackbar();
            this.retrieveTimeValues(startOrEnd);
        }
    }

    toggleForceOutputValue() {
        this.updateToggleForceDepartureValue.emit(this.forceDeparture);
    }

    openNotValidSnackbar() {
        this.toastService.displayWebsiteRelatedToast(
            'Los valores para el horario de reparto no son válidos',
            this._translate.instant('GENERAL.ACCEPT')
        );
    }

    retrieveTimeValues(startOrEnd: string) {
        if (!startOrEnd || startOrEnd == 'start') {
            if (this.deliveryScheduleStart) {
                this.start = secondsToDayTimeAsString(this.deliveryScheduleStart);
            } else {
                this.start = '00:00';
            }
        }
        if (!startOrEnd || startOrEnd == 'end') {
            if (this.deliveryScheduleEnd) {
                this.end = secondsToDayTimeAsString(this.deliveryScheduleEnd);
            } else {
                this.end = '23:59';
            }
        }
    }

    constructor(private toastService: ToastService,
                private _translate:TranslateService) {}

    ngOnInit() {
        this.retrieveTimeValues(null);
    }
}
