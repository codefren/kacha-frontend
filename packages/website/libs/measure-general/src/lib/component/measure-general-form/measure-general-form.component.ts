import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeasureInterface } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';
import { MeasureGeneralService } from '../../measure-general.service';
import { LoadingService, MeasureMessages, ToastService } from '@optimroute/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'lib-measure-general-form',
    templateUrl: './measure-general-form.component.html',
    styleUrls: ['./measure-general-form.component.scss'],
})
export class MeasureGeneralFormComponent implements OnInit {
    data: any;
    measureForm: FormGroup;
    measure_messages: any;
    titleTranslate: string;

    constructor(
        private fb: FormBuilder,
        private loading: LoadingService,
        private _measureGeneralService: MeasureGeneralService,
        private _translate: TranslateService,
        private _toastService: ToastService,
        public activeModal: NgbActiveModal,
    ) {}

    ngOnInit() {
        this.validaciones(this.data.measure);
    }

    async validaciones(measure: MeasureInterface) {
        this.measureForm = this.fb.group({
            name: [
                measure.name,
                [Validators.required, Validators.maxLength(100), Validators.minLength(2)],
            ],
            code: [
                measure.code,
                [Validators.required, Validators.maxLength(30), Validators.minLength(1)],
            ],
            isActive: [measure.isActive, [Validators.required]],
        });

        let measure_messages = new MeasureMessages();
        this.measure_messages = measure_messages.getMeasureMessages();
    }

    closeDialog(value: any) {
        this.activeModal.close(value);
    }

    isFormInvalid(): boolean {
        return !this.measureForm.valid;
    }

    createMeasureGeneral() {
        if (this.isFormInvalid()) {
            this._toastService.displayWebsiteRelatedToast('The measure is not valid'),
                this._translate.instant('GENERAL.ACCEPT');
        } else {
            if (this.data.measure.id && this.data.measure.id > 0) {
                this.loading.showLoading();
                this._measureGeneralService
                    .updateMeasureGeneral(this.data.measure.id, this.measureForm.value)
                    .subscribe(
                        (data: any) => {
                            this.loading.hideLoading();

                            this._toastService.displayWebsiteRelatedToast(
                                this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                                this._translate.instant('GENERAL.ACCEPT'),
                            );

                            this.closeDialog([true, { ok: true }]);
                        },
                        (error) => {
                            this.loading.hideLoading();
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );

                            return;
                        },
                    );
            } else {
                this.loading.showLoading();
                this._measureGeneralService
                    .registerMeasureGeneral(this.measureForm.value)
                    .subscribe(
                        (data: any) => {
                            this.loading.hideLoading();

                            this._toastService.displayWebsiteRelatedToast(
                                this._translate.instant('GENERAL.REGISTRATION'),
                                this._translate.instant('GENERAL.ACCEPT'),
                            );

                            this.closeDialog([true, { ok: true }]);
                        },
                        (error) => {
                            this.loading.hideLoading();
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );

                            return;
                        },
                    );
            }
        }
    }

    changeActive() {
        if (this.data.measure.isActive == true) {
            this.data.measure.isActive = false;

            this.measureForm.controls['isActive'].setValue(this.data.measure.isActive);
        } else if (this.data.measure.isActive == false) {
            this.data.measure.isActive = true;

            this.measureForm.controls['isActive'].setValue(this.data.measure.isActive);
        }
    }
}
